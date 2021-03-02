const Studio = load.singleton('studio');
const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

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
        setDefaults() {
            this.name = Studio.getNextComponentName('Panel');
            this.width = this.height = 200;
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
        setDefaults() {
            this.name = Studio.getNextComponentName('Button');
            this.width = 130;
            this.height = 35;
            this.label = t('Click Me');
        }
        getRenderedHTML() {
            const attributes = this.getTraitsAttributes({ class: ['component', 'button'] });
            return Component.HTMLBuilder.make('button', attributes, this.label);
        }
    }

};
