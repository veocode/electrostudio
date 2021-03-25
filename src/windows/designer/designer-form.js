const Form = load.class('form');

class DesignerForm extends Form {

    getSchema() {
        return {
            name: 'designer',
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

    // buildComponents() {

    //     const pane1 = this.createComponent('LayoutPane', {
    //         weight: 0.25,
    //         backgroundColor: '#ECECEC'
    //     });

    //     const pane2 = this.createComponent('LayoutPane', {
    //         weight: 0.25,
    //         backgroundColor: '#DDD'
    //     });

    //     const pane3 = this.createComponent('LayoutPane', {
    //         weight: 0.5,
    //         backgroundColor: '#CCC'
    //     });

    //     const layout = this.createComponent('Layout', {});

    //     layout.addChildren(pane1, pane2, pane3);
    //     this.addChildren(layout);

    // }

}

module.exports = DesignerForm;
