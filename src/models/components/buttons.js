const { Component } = load.class('component');
const Traits = load.models.traits();

class Button extends Component {
    static getIcon() {
        return 'square';
    }
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.HintTrait(),
            new Traits.AlignmentTrait(),
            new Traits.EnabledTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.DataTrait(),
        ]);
    }
    setDefaults() {
        this.width = 130;
        this.height = 35;
        this.label = t('Click Me');
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
            Component.EventNames.Focus,
        )
    }
    buildDOM() {
        return this.buildTagDOM('button', { class: ['component', 'button'] }, this.label);
    }
}

class ToolButton extends Button {
    getTraits() {
        return super.getTraits().concat([
            new Traits.IconTrait(),
        ]);
    }
    setDefaults() {
        this.icon = 'bolt';
        this.width = 48;
        this.height = 48;
        this.label = '';
    }
    buildDOM() {
        const content = `<i class="fa fa-${this.icon}"></i>` + (this.label ? ` ${this.label}` : '');
        return this.buildTagDOM('button', { class: ['component', 'button', 'toolbutton'] }, content);
    }
}

module.exports = {
    groupName: t('Buttons'),
    classes: {
        Button,
        ToolButton
    }
}
