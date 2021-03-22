const Form = load.class('form');

class DesignerForm extends Form {

    getSchema() {
        return {
            name: 'designer',
            title: t('Form Designer'),
            left: 400,
            top: 120,
            width: 200,
            height: 200,
            resizable: true,
            maximizable: true,
            minimizable: true,
            isDebug: true,
        };
    }

}

module.exports = DesignerForm;
