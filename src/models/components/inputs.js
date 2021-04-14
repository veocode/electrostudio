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
            Component.EventNames.Mouse,
            Component.EventNames.Focus,
        )
    }

    buildDOM() {
        const $input = this.buildTagDOM('input', { class: ['component', 'input'] });
        $input.change(() => {
            this.assignPropertyValue('value', $input.val());
        })
        return $input;
    }

}

module.exports = {
    groupName: t('Inputs'),
    classes: {
        Input
    }
}
