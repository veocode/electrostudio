const { Component } = load.class('component');
const Traits = load.models.traits();

class PropertyEditor extends Component {

    #schema = {};
    #callbacks = {};

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.AlignmentTrait(),
        ]);
    }

    setDefaults() {
        this.alignment = 'client';
    }

    setSchema(schema) {
        this.#schema = schema;
        this.buildEditor();
    }

    setCallbacks(callbacks) {
        this.#callbacks = Object.assign({}, this.#callbacks, callbacks);
    }

    buildDOM() {
        const $dom = this.buildTagDOM('div', { class: ['component', 'prop-editor'] });
        return $dom;
    }

    buildEditor() {
        const props = this.getComponentProps(this.#schema.className);
        const values = this.#schema.properties;

        this.$dom.empty();

        for (let [name, prop] of Object.entries(props)) {

            const $row = $('<div/>', { class: 'row' }).appendTo(this.$dom);
            const $titleCell = $('<div/>', { class: 'cell title' }).appendTo($row);
            const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);
            const currentValue = values[prop.name];

            const $valueInput = prop.buildInput(currentValue, {
                result: newValue => {
                    this.onInputResult(prop, currentValue, newValue);
                },
                error: message => {
                    this.onInputError(prop, currentValue, message);
                }
            });

            $titleCell.html(prop.name);
            $valueCell.append($valueInput);
        }
    }

    getComponentProps(componentClassName) {
        const { ComponentFactory } = load.class('factories');
        const component = ComponentFactory.Create(componentClassName);
        return component.getProperties();
    }

    onInputResult(prop, previousValue, value) {
        if ('result' in this.#callbacks) {
            this.#callbacks.result(prop, previousValue, value);
        }
    }

    onInputError(prop, previousValue, message) {
        alert(`${t('Validation Error')}: ${message}`);
        prop.setInputValue(previousValue);
    }

}

module.exports = {
    groupName: null,
    classes: {
        PropertyEditor
    }
}
