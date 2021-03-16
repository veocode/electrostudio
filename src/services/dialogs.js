const Service = load.class('service');
const dialog = load.electron('dialog');

class DialogsService extends Service {

    showMessageDialog(message, title = config.appTitle, type = 'info') {
        const params = {
            title,
            message,
            type,
            buttons: [t('Ok')]
        };

        return dialog.showMessageBox(params);
    }

}

module.exports = DialogsService;