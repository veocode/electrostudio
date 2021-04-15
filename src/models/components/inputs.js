const { Component } = load.class('component');
const Traits = load.models.traits();

class Input extends Component {

    static getIcon() {
        return 'form-textbox';
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.TextAlignTrait(),
            new Traits.InputTrait(),
        ]);
    }

    setDefaults() {
        this.width = 240;
    }

    getEventNames() {
        return [].concat(
            Component.EventNames.Input,
            Component.EventNames.Mouse,
            Component.EventNames.Focus,
            Component.EventNames.Keyboard
        )
    }

    getDefaultEventName() {
        return 'change';
    }

    buildDOM() {
        const $input = this.buildTagDOM('input', { class: ['component', 'input'] });
        $input.keyup(() => {
            this.assignPropertyValue('value', $input.val());
        })
        return $input;
    }

}

class TextArea extends Input {

    static getIcon() {
        return 'form-textarea';
    }

    setDefaults() {
        this.width = 320;
        this.height = 240;
    }

    buildDOM() {
        const $input = this.buildTagDOM('textarea', { class: ['component', 'textarea'] });
        $input.val(this.value);
        $input.keyup(() => {
            this.assignPropertyValue('value', $input.val());
        })
        return $input;
    }

}

module.exports = {
    groupName: t('TextArea'),
    classes: {
        Input,
        TextArea
    }
}
