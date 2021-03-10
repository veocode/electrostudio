const { Component } = load.class('component');
const Traits = load.models.traits();

class MessageDialog extends Component {

    isVirtual = true;

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.PositionTrait(),
        ]);
    }

    show(message, type = 'info', buttons = [t('Ok')]) {
        const { dialog } = require('electron').remote;
        return dialog.showMessageBox({
            message,
            type,
            buttons
        });
    }

}

module.exports = {
    groupName: t('Dialogs'),
    classes: {
        MessageDialog
    }
}
