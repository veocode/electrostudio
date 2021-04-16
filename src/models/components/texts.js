const { Component } = load.class('component');
const Traits = load.models.traits();

class Label extends Component {

    static getIcon() {
        return 'format-color-text';
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.LabelTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.PaddingTrait(),
            new Traits.TextColorTrait(),
            new Traits.TextAlignTrait(),
            new Traits.BackgroundColorTrait(),
        ]);
    }

    setDefaults() {
        this.label = t('Label');
    }

    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }

    buildDOM() {
        const $labelText = $('<span/>', { class: 'label-text' }).html(this.label);
        return this.buildTagDOM('div', { class: ['component', 'label'] }, $labelText);
    }

}

module.exports = {
    groupName: t('Text'),
    classes: {
        Label
    }
}
