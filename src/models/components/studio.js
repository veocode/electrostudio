const { Component } = load.class('component');
const Property = load.class('property');
const Traits = load.models.traits();

class InspectorPropertyEditor extends Component {

    events = load.instance('classes/eventmanager');

    #schema = {};

    static isInternal() {
        return true;
    }

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

    clearSchema() {
        this.$dom.empty();
        this.#schema = {};
    }

    setParentSchema(parentSchema) {
        this.buildParentSelector(parentSchema);
    }

    buildDOM() {
        return this.buildTagDOM('div', { class: ['component', 'prop-editor'] });
    }

    buildEditor() {
        const props = this.getComponentProps(this.#schema.className);
        const values = this.#schema.properties;

        this.$dom.empty();

        for (let [name, prop] of Object.entries(props)) {
            const $row = $('<div/>', { class: `row row-${name}` }).appendTo(this.$dom);
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

    buildParentSelector(parentSchema) {
        const $row = $('<div/>', { class: 'row row-parent' }).prependTo(this.$dom);
        const $titleCell = $('<div/>', { class: 'cell title' }).html(t('Parent')).appendTo($row);
        const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);

        const $parentLink = $('<a href="#"/>').html(parentSchema.properties.name).appendTo($valueCell);

        $parentLink.on('click', event => {
            event.preventDefault();
            this.events.emit('parent-selected', parentSchema.properties.name);
        });
    }

    getComponentProps(componentClassName) {
        const { ComponentFactory } = load.class('factories');
        const component = ComponentFactory.Create(componentClassName);
        return component.getProperties();
    }

    onInputResult(prop, previousValue, value) {
        this.events.emit('input-result', prop, previousValue, value);
    }

    onInputError(prop, previousValue, message) {
        this.events.emit('input-error', message);
        prop.setInputValue(previousValue);
    }

}

class InspectorEventEditor extends Component {

    events = load.instance('classes/eventmanager');

    #schema = {};

    static isInternal() {
        return true;
    }

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

    clearSchema() {
        this.$dom.empty();
        this.#schema = {};
    }

    buildDOM() {
        return this.buildTagDOM('div', { class: ['component', 'prop-editor'] });;
    }

    buildEditor() {
        const events = this.#schema.events;

        this.$dom.empty();

        for (let [eventName, handlerName] of Object.entries(events)) {
            const $row = $('<div/>', { class: `row row-${eventName}` }).appendTo(this.$dom);
            const $titleCell = $('<div/>', { class: 'cell title' }).appendTo($row);
            const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);

            const currentValue = handlerName ?? '';
            const $valueInput = $('<input/>', { type: 'text', class: 'prop-input', value: currentValue });
            $valueInput.on('keydown', event => {
                if (event.keyCode == 13) {
                    const newValue = $valueInput.val();
                    if (!newValue) {
                        this.onInputError(t('Bad value'));
                        $valueInput.val(currentValue);
                        return;
                    }
                    this.onInputResult(eventName, currentValue, newValue);
                }
            });

            $titleCell.html(eventName);
            $valueCell.append($valueInput);
        }
    }

    onInputResult(eventName, previousValue, value) {
        this.events.emit('input-result', eventName, previousValue, value);
    }

    onInputError(message, previousValue) {
        this.events.emit('input-error', message);
        prop.setInputValue(previousValue);
    }

}

module.exports = {
    groupName: null,
    classes: {
        InspectorPropertyEditor,
        InspectorEventEditor
    }
}
