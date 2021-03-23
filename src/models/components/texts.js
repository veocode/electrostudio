const { Component } = load.class('component');
const Traits = load.models.traits();

class Label extends Component {
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.PositionTrait(),
            new Traits.TextColorTrait()
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
        return this.buildTagDOM('div', { class: ['component', 'label'] }, this.label);
    }
}

module.exports = {
    groupName: t('Text'),
    classes: {
        Label
    }
}
