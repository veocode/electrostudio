const Window = load.class('window');
const Utils = load.class('utils');

class MainWindow extends Window {

    dialogService = this.getService('dialogs');
    studioService = this.getService('studio/studio');
    projectService = this.getService('studio/project');

    taskRunnerForm = load.form('tools/taskrunner');

    inspectorForm;
    designerForm;
    editorForm;

    selectedComponentClass = null;
    isProjectDirty = false;

    start() {
        this.bindShortcuts();
        this.initTaskRunner();
        this.startProject();
    }

    bindShortcuts() {
        this.onShortcut(['ctrl+s', 'command+s'], () => {
            this.saveProject();
        });
    }

    async startProject() {
        const projectName = await this.projectService.getName();
        this.setTitleDocument(projectName);
        this.openActiveProjectForm();
    }

    async openActiveProjectForm() {
        const activeFormSchema = await this.projectService.getActiveFormSchema();
        const activeFormComponentSchemas = await this.projectService.getActiveFormComponents();
        const activeFormWindowFile = await this.projectService.getActiveFormWindowFilePath();

        if (this.inspectorForm) { this.inspectorForm.closeWindow(); }
        if (this.designerForm) { this.designerForm.closeWindow(); }

        this.inspectorForm = load.form('app/inspector');
        this.designerForm = load.form('app/designer');
        this.editorForm = load.form('app/editor');

        this.bindInspectorEvents();
        this.bindDesignerEvents();
        this.bindEditorEvents();

        this.inspectorForm.createWindow();

        this.designerForm.createWindow({
            schema: activeFormSchema,
            components: activeFormComponentSchemas
        });

        this.editorForm.createWindow({
            filePath: activeFormWindowFile
        });
    }

    initTaskRunner() {
        this.taskRunnerForm.on('closed', () => {
            this.show();
            this.designerForm.showWindow();
            this.editorForm.showWindow();
            this.inspectorForm.showWindow();
        })
    }

    bindDesignerEvents() {
        this.designerForm.on('component:selected', payload => {
            this.inspectorForm.send('component:show', payload);
        });

        this.designerForm.on('component:deselected', payload => {
            this.inspectorForm.send('component:hide', payload);
        });

        this.designerForm.on('component:added', payload => {
            this.deselectComponentClass();
        });

        this.designerForm.on('component:event-auto-create', (payload) => {
            const { componentName, eventName } = payload;
            this.onComponentEventAutoCreate(componentName, eventName);
        });

        this.designerForm.on('form:updated', schema => {
            this.setProjectDirty(true);
            this.projectService.updateActiveForm(schema);
        });

        this.designerForm.on('project:save', () => {
            this.saveProject();
        });
    }

    bindEditorEvents() {
        this.editorForm.on('file:save', (payload) => {
            const { filePath, content } = payload;
            this.studioService.saveProjectFile(filePath, content);
        });
    }

    bindInspectorEvents() {
        this.inspectorForm.on('component:prop-updated', (payload) => {
            this.designerForm.send('component:prop-updated', payload);
        });

        this.inspectorForm.on('component:event-updated', (payload) => {
            this.designerForm.send('component:event-updated', payload);
        });

        this.inspectorForm.on('component:event-auto-create', (payload) => {
            const { componentName, eventName } = payload;
            this.onComponentEventAutoCreate(componentName, eventName);
        });

        this.inspectorForm.on('component:parent-selected', (name) => {
            this.designerForm.send('component:parent-selected', name);
        });

        this.inspectorForm.on('component:action', (methodName) => {
            this.designerForm.send('component:action', methodName);
        });
    }

    async onBtnRunProjectClick(event, sender) {
        const isProjectDirty = await this.projectService.isDirty();

        if (isProjectDirty) {
            const dialogResult = await this.dialogService.showMessageDialog({
                type: 'question',
                message: t('Project has unsaved changes.\nSave Project before run?'),
                buttons: [t('Yes'), t('No')]
            })

            if (dialogResult.response == 0) {
                await this.saveProject();
            }
        }

        this.designerForm.hideWindow();
        this.editorForm.hideWindow();
        this.inspectorForm.hideWindow();
        this.hide();
        this.taskRunnerForm.createWindow({ taskName: 'project-run' });
    }

    async onBtnSaveProjectClick(event, sender) {
        await this.saveProject();
    }

    async saveProject() {
        await this.studioService.saveProject();
        this.setProjectDirty(false);
    }

    setProjectDirty(isDirty) {
        this.isProjectDirty = isDirty;
        this.setTitleDirty(isDirty);
    }

    onBtnComponentPalleteClick(event, senderToolButton) {
        const componentClass = senderToolButton.metaData;

        if (componentClass == this.selectedComponentClass) {
            this.deselectComponentClass();
            return;
        }

        this.selectComponentClass(componentClass);
    }

    deselectComponentClass() {
        this.toolbarComponents.deactivateButton();
        if (this.selectedComponentClass) {
            this.selectedComponentClass = null;
            this.designerForm.send('component:class-deselected');
        }
    }

    selectComponentClass(componentClass) {
        this.selectedComponentClass = componentClass;
        this.designerForm.send('component:class-selected', componentClass);
    }

    onComponentEventAutoCreate(componentName, eventName) {
        const handlerName = Utils.joinAsCamelCase(['on', componentName, eventName]);

        this.inspectorForm.send('component:event-updated', {
            eventName,
            handlerName
        });

        this.designerForm.send('component:event-updated', {
            eventName,
            handlerName
        });

        this.editorForm.send('file:method-add', {
            methodName: handlerName,
            methodArgs: 'event, sender',
            methodBody: '// TODO: Add Implementation'
        });

        this.editorForm.showWindow();
    }

}

module.exports = MainWindow;