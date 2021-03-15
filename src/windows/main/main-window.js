const Window = load.class('window');

class MainWindow extends Window {

    start() {
        // TODO: add initialization logic
    }

    async onBtnNewProjectClick(event, sender) {

        const dialogService = this.getService('dialogs');

        const result = await dialogService.showMessageDialog('Hello world');

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