const Window = load.class('window');

class MainWindow extends Window {

    start() {
        // TODO: add initialization logic
    }

    onBtnNewProjectClick(event, sender) {

        this.getService('dialogs').showMessageDialog('Hello world', 'My Dialog', 'info');

        // this.getService('dialogs').showMessageDialog({
        //     type: 'info',
        //     title: 'Message',
        //     text: 'Hello world',
        // });

        // this.MessageDialog1.label = 'My Message';
        // this.MessageDialog1.text = 'Hello Beautiful World';

        // this.MessageDialog1.show().then(
        //     result => alert(`You clicked button #${result.response}`)
        // );
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