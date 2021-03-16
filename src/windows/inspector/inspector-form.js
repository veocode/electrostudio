const Form = load.class('form');

class InspectorForm extends Form {

    getSchema() {
        return {
            name: 'inspector',
            title: t('Object Inspector'),
            left: 0,
            top: 100,
            width: 330,
            height: 550,
            resizable: true,
            maximizable: false,
            minimizable: false,
        };
    }

    buildComponents() {
        const panel = this.createComponent('Panel', {
            alignment: 'client'
        });

        this.addChildren(panel);
    }

}

module.exports = InspectorForm;
