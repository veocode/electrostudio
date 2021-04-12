const Window = load.class('window');

class MainWindow extends Window {

    dialogService = this.getService('dialogs');
    studioService = this.getService('studio/studio');
    projectService = this.getService('studio/project');

    inspectorForm;
    designerForm;
    taskRunnerForm = load.form('taskrunner');

    selectedComponentClass = null;

    start() {
        this.initTaskRunner();
        this.startProject();
    }

    startProject() {
        this.openActiveProjectForm();
    }

    async openActiveProjectForm() {
        const activeFormSchema = await this.projectService.getActiveFormSchema();
        const activeFormComponentSchemas = await this.projectService.getActiveFormComponents();

        if (this.inspectorForm) { this.inspectorForm.closeWindow(); }
        if (this.designerForm) { this.designerForm.closeWindow(); }

        this.inspectorForm = load.form('inspector');
        this.designerForm = load.form('designer');

        this.bindInspectorEvents();
        this.bindDesignerEvents();

        this.inspectorForm.createWindow();
        this.designerForm.createWindow({
            schema: activeFormSchema,
            components: activeFormComponentSchemas
        });
    }

    initTaskRunner() {
        this.taskRunnerForm.on('closed', () => {
            this.designerForm.showWindow();
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

        this.designerForm.on('form:updated', schema => {
            this.projectService.updateActiveForm(schema);
        });
    }

    bindInspectorEvents() {
        this.inspectorForm.on('component:prop-updated', (payload) => {
            this.designerForm.send('component:prop-updated', payload);
        });

        this.inspectorForm.on('component:event-updated', (payload) => {
            this.designerForm.send('component:event-updated', payload);
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
        this.inspectorForm.hideWindow();
        this.taskRunnerForm.createWindow({ taskName: 'project-run' });
    }

    async onBtnSaveProjectClick(event, sender) {
        await this.saveProject();
    }

    saveProject() {
        return this.studioService.saveProject();
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

}

module.exports = MainWindow;