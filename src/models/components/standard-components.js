const { Component, ContainerComponent } = load.class('component');
const Traits = load.model('traits/component-traits');

module.exports = {

    Panel: class extends ContainerComponent {
        getTraits() {
            return [
                new Traits.NameTrait(),
                new Traits.AlignmentTrait(),
                new Traits.PositionTrait(),
                new Traits.SizeTrait(),
            ]
        }
        getRenderedHTML() {
            const attributes = this.getTraitsAttributes({ class: ['component', 'panel'] });
            const content = this.getRenderedChildrenHTML();
            return Component.HTMLBuilder.make('div', attributes, content);
        }
    },

    Button: class extends Component {
        getTraits() {
            return [
                new Traits.NameTrait(),
                new Traits.LabelTrait(),
                new Traits.AlignmentTrait(),
                new Traits.PositionTrait(),
                new Traits.SizeTrait(),
            ]
        }
        getRenderedHTML() {
            const attributes = this.getTraitsAttributes({ class: ['component', 'button'] });
            return Component.HTMLBuilder.make('button', attributes, this.label);
        }
    }

};
