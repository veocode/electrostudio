const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class Button extends Component {
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.HintTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
        ]);
    }
    setDefaults() {
        this.width = 130;
        this.height = 35;
        this.label = t('Click Me');
    }
    getRenderedHTML() {
        const attributes = this.getTraitsAttributes({ class: ['component', 'button'] });
        return Component.HTMLBuilder.make('button', attributes, '<i class="fa fa-download"></i> ' + this.label);
    }
}

class ToolButton extends Button {
    getTraits() {
        return super.getTraits().concat([
            new Traits.IconTrait(),
        ]);
    }
    setDefaults() {
        this.width = 48;
        this.height = 48;
        this.label = '';
    }
    getRenderedHTML() {
        const attributes = this.getTraitsAttributes({ class: ['component', 'button'] });
        const content = `<i class="fa fa-${this.icon}"></i>` + (this.label ? ` ${this.label}` : '');
        return Component.HTMLBuilder.make('button', attributes, content);
    }
}

module.exports = {
    Button,
    ToolButton
}