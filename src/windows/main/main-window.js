const Window = load.class('window');

class MainWindow extends Window {

    dialogService = this.getService('dialogs');
    projectService = this.getService('studio/project');

    forms = {
        inspector: load.form('inspector'),
        designer: load.form('designer'),
    }

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
        for (let [name, form] of Object.entries(this.forms)) {
            form.createWindow();
        }
    }

    bindDesignerEvents() {
        this.forms.designer.on('component:selected', (payload) => {
            this.forms.inspector.send('component:show', payload);
        });

        this.forms.designer.on('component:deselected', (payload) => {
            this.forms.inspector.send('component:hide', payload);
        });

        this.forms.designer.on('component:added', (payload) => {
            this.deselectComponentClass();
        });
    }

    bindInspectorEvents() {
        this.forms.inspector.on('component:prop-updated', (payload) => {
            this.forms.designer.send('component:prop-updated', payload);
        });

        this.forms.inspector.on('component:parent-selected', (name) => {
            this.forms.designer.send('component:parent-selected', name);
        });

        this.forms.inspector.on('component:action', (methodName) => {
            this.forms.designer.send('component:action', methodName);
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
            this.forms.designer.send('component:class-deselected');
        }
    }

    selectComponentClass(componentClass) {
        this.selectedComponentClass = componentClass;
        this.forms.designer.send('component:class-selected', componentClass);
    }

}

module.exports = MainWindow;