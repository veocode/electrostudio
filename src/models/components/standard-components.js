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
            return `<div class="component panel">${this.getRenderedChildrenHTML()}</div>`;
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
            return `<button class="component button">${this.label}</button>`;
        }
    }

};
