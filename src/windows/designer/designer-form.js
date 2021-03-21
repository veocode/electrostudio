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

    buildComponents() {

        const panel = this.createComponent('Panel', {
            alignment: 'client'
        });

        panel.addChildren(this.createComponent('Button', {
            label: 'Click Me!',
            width: 200,
            height: 50,
            left: 40,
            top: 40
        }));

        panel.addChildren(this.createComponent('Button', {
            label: 'Click Me 2',
            width: 120,
            height: 35,
            left: 40,
            top: 80
        }));


        this.addChildren(panel);

        console.log(this.getSchema());

    }

}

module.exports = DesignerForm;
