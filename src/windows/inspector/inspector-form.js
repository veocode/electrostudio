const Form = load.class('form');

class InspectorForm extends Form {

    #editor;

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
            isDebug: true
        };
    }

    buildComponents() {
        this.#editor = this.createComponent('PropertyEditor');
        this.addChildren(this.#editor);
    }

    getEditor() {
        return this.#editor;
    }

}

module.exports = InspectorForm;
