const Form = load.class('form');

class ProgressForm extends Form {

    getSchema() {
        return {
            name: 'progress',
            title: t('Work In Progress') + '...',
            left: 0,
            top: 120,
            width: 330,
            height: 550,
            resizable: true,
            maximizable: false,
            minimizable: false,
            // isDebug: true
        };
    }

    buildComponents() {

    }

}

module.exports = ProgressForm;
