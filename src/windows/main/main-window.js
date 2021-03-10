const Window = load.class('window');

class MainWindow extends Window {

    start() {
        // TODO: add initialization logic
        const btnDynamic = this.form.createComponent('ToolButton', {
            name: 'btnDynamic',
            icon: 'bolt',
            hint: t('Dynamic Button')
        }, {
            click: 'onBtnDynamicClick'
        });

        this.ToolPanel1.addChildren(btnDynamic);
    }

    onBtnNewProjectClick(event, sender) {
        this.MessageDialog1.show('Hello World');
    }

    onBtnSaveProjectClick(event, sender) {

    }

    onBtnDynamicClick(event, sender) {
        alert('Clicked: ' + sender.name);
    }

}

module.exports = MainWindow;