const Window = load.class('window');

class MainWindow extends Window {

    forms = {
        inspector: load.form('inspector'),
        designer: load.form('designer'),
    }

    start() {
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
        this.forms.designer.on('component:selected', (componentPropValues) => {
            this.forms.inspector.send('component:show', componentPropValues);
        });
    }

    bindInspectorEvents() {
        this.forms.inspector.on('component:prop-updated', (payload) => {
            this.forms.designer.send('component:prop-updated', payload);
        });
    }

    async onBtnNewProjectClick(event, sender) {

        const dialogService = this.getService('dialogs');

        const result = await dialogService.showOpenDialog({
            title: t('Select New Project folder'),
            properties: ['openDirectory']
        });

        console.log('DIALOG RESULT:', result);

    }

    onBtnSaveProjectClick(event, sender) {
        const btnDynamic = this.form.createComponent('ToolButton', {
            name: 'btnDynamic',
            icon: 'bolt',
            hint: t('Dynamic Button')
        }, {
            click: 'onBtnDynamicClick'
        });

        this.ToolPanel1.addChildren(btnDynamic);
    }

    onBtnDynamicClick(event, sender) {
        alert('Clicked: ' + sender.name);
    }

}

module.exports = MainWindow;