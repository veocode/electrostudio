const Form = load.class('form');

class DesignerForm extends Form {

    getSchema() {
        return {
            name: 'designer',
            title: t('Form Designer'),
            left: 400,
            top: 100,
            width: 300,
            height: 300,
            resizable: true,
            maximizable: true,
            minimizable: true,
        };
    }

}

module.exports = DesignerForm;
