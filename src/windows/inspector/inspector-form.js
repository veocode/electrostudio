const Form = load.class('form');

class InspectorForm extends Form {

    getSchema() {
        return {
            name: 'inspector',
            title: t('Object Inspector'),
            left: 0,
            top: 120,
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
        }, {
            click: 'onPanelClick'
        });

        panel.addChildren(this.createComponent('Label', {
            left: 20,
            top: 20,
            color: '#FFF'
        }));

        this.addChildren(panel);
    }

}

module.exports = InspectorForm;
