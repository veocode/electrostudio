const Window = load.class('window');

class MainWindow extends Window {

    dialogService = this.getService('dialogs');
    projectService = this.getService('studio/project');

    inspectorForm = load.form('inspector');
    designerForm = load.form('designer');

    selectedComponentClass = null;

    start() {
        this.startProject();
    }

    startProject() {
        this.createForms();
        this.bindDesignerEvents();
        this.bindInspectorEvents();
    }

    createForms() {
        this.designerForm.createWindow();
        this.inspectorForm.createWindow();
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

        this.inspectorForm.on('component:parent-selected', (name) => {
            this.designerForm.send('component:parent-selected', name);
        });

        this.inspectorForm.on('component:action', (methodName) => {
            this.designerForm.send('component:action', methodName);
        });
    }

    async onBtnNewProjectClick(event, sender) {
        const result = await this.dialogService.showOpenDialog({
            title: t('Select New Project Folder'),
            properties: ['openDirectory']
        });
    }

    async onBtnSaveProjectClick(event, sender) {
        const isFolderSelected = await this.projectService.isFolderSelected()

        if (!isFolderSelected) {
            const result = await this.dialogService.showOpenDialog({
                title: t('Select New Project Folder'),
                properties: ['openDirectory']
            });

            if (result.canceled || !result.filePaths[0]) { return; }

            const folder = result.filePaths[0];
            await this.projectService.setFolder(folder);
        }

        await this.projectService.save();
        settings.set('lastProjectFolder', folder);
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