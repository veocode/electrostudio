const Window = load.class('window');

class MainWindow extends Window {

    dialogService = this.getService('dialogs');
    projectService = this.getService('studio/project');

    inspectorForm = load.form('inspector');
    designerForm = load.form('designer');
    taskRunnerForm = load.form('taskrunner');

    selectedComponentClass = null;

    start() {
        this.startProject();
        this.initTaskRunner();
    }

    startProject() {
        this.createForms();
        this.bindDesignerEvents();
        this.bindInspectorEvents();
    }

    createForms() {
        this.inspectorForm.createWindow();
        this.designerForm.createWindow();
    }

    initTaskRunner() {
        this.taskRunnerForm.on('closed', () => {
            this.designerForm.showWindow();
            this.inspectorForm.showWindow();
        })
    }

    bindDesignerEvents() {
        this.designerForm.on('component:selected', (payload) => {
            this.inspectorForm.send('component:show', payload);
        });

        this.designerForm.on('component:deselected', (payload) => {
            this.inspectorForm.send('component:hide', payload);
        });

        this.designerForm.on('component:added', (payload) => {
            this.deselectComponentClass();
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

    async onBtnNewProjectClick(event, sender) {

    }

    async onBtnOpenProjectClick(event, sender) {
        const isProjectDirty = await this.projectService.isDirty();

        if (isProjectDirty) {
            const dialogResult = await this.dialogService.showMessageDialog({
                type: 'question',
                message: t('Project has unsaved changes.\nSave Project before run?'),
                buttons: [t('Yes'), t('No')]
            })

            if (dialogResult.response == 0) {
                const isSaved = await this.saveProject();
                if (!isSaved) { return; }
            }
        }

        this.designerForm.hideWindow();
        this.inspectorForm.hideWindow();
        this.taskRunnerForm.createWindow({ taskName: 'project-run' });
    }

    onBtnSaveProjectClick(event, sender) {
        this.saveProject();
    }

    saveProject() {
        return new Promise(async resolve => {
            const isFolderSelected = await this.projectService.isFolderSelected()

            if (!isFolderSelected) {
                const result = await this.dialogService.showOpenDialog({
                    title: t('Select New Project Folder'),
                    properties: ['openDirectory']
                });

                if (result.canceled || !result.filePaths[0]) {
                    resolve(false);
                    return;
                }

                const folder = result.filePaths[0];
                settings.set('lastProjectFolder', folder);
                await this.projectService.setFolder(folder);
            }

            await this.projectService.save();
            resolve(true);
        });
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