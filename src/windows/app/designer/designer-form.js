const Form = load.class('form');

class DesignerForm extends Form {

    getSchema() {
        return {
            name: 'app/designer',
            title: t('Form Designer'),
            left: 400,
            top: 120,
            width: 640,
            height: 480,
            resizable: true,
            maximizable: true,
            minimizable: true,
            isDebug: true,
        };
    }

}

module.exports = DesignerForm;
