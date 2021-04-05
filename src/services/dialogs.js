const Service = load.class('service');
const dialog = load.electron('dialog');

class DialogsService extends Service {

    showMessageDialog(caller, options) {
        const defaultOptions = {
            title: config.appTitle,
            message: t('Message'),
            type: 'info',
            buttons: [t('Ok')]
        }

        options = Object.assign(defaultOptions, options);
        return dialog.showMessageBox(caller.window, options);
    }

    showErrorDialog(caller, message) {
        return this.showMessageDialog(caller, {
            title: t('An Error Occured'),
            type: 'error',
            message,
        });
    }

    showOpenDialog(caller, options) {
        const defaultOptions = {}

        options = Object.assign(defaultOptions, options);
        return dialog.showOpenDialog(caller.window, options);
    }

    showSaveDialog(caller, options) {
        const defaultOptions = {}

        options = Object.assign(defaultOptions, options);
        return dialog.showSaveDialog(caller.window, options);
    }

}

module.exports = DialogsService;