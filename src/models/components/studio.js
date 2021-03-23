const { Component } = load.class('component');
const Traits = load.models.traits();

class PropertyEditor extends Component {

    #schema = {};

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

    buildDOM() {
        const $dom = this.buildTagDOM('div', { class: ['component', 'prop-editor'] });
        return $dom;
    }

    buildEditor() {
        const props = this.getComponentProps(this.#schema.className);
        const values = this.#schema.properties;

        this.$dom.empty();

        for (let [name, prop] of Object.entries(props)) {
            const $row = $('<div></div>').addClass('row').appendTo(this.$dom);
            const $titleCell = $('<div></div>').addClass('cell').addClass('title').appendTo($row);
            const $valueCell = $('<div></div>').addClass('cell').addClass('value').appendTo($row);

            $titleCell.html(prop.name);
            $valueCell.html(values[prop.name]);
        }
    }

    getComponentProps(componentClassName) {
        const { ComponentFactory } = load.class('factories');
        const component = ComponentFactory.Create(componentClassName);
        return component.getProperties();
    }

}

module.exports = {
    groupName: null,
    classes: {
        PropertyEditor
    }
}
