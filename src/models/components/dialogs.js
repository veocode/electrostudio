const { Component } = load.class('component');
const Traits = load.models.traits();

class MessageDialog extends Component {

    isVirtual = true;

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.TextTrait(),
            new Traits.Dialogs.TypeTrait(),
            new Traits.Dialogs.ButtonsTrait(),
            new Traits.PositionTrait()
        ]);
    }

    setDefaults() {
        this.label = t('Message Dialog');
        this.text = t('Message Text');
        this.type = 'info';
        this.buttons = `${t('Ok')},${t('Cancel')}`;
    }

    show() {
        const { dialog } = require('electron').remote;
        const params = {
            title: this.label,
            message: this.text,
            type: this.type,
            buttons: this.buttons.split(',')
        };
        return dialog.showMessageBox(params);
    }

}

module.exports = {
    groupName: t('Dialogs'),
    classes: {
        MessageDialog
    }
}
