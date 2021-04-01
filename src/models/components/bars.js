const { Component } = load.class('component');
const Traits = load.models.traits();


class ProgressBar extends Component {
    static getIcon() {
        return 'spinner';
    }
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.ProgressBarTrait(),
            new Traits.MetaDataTrait(),
        ]);
    }
    setDefaults() {
        this.width = 300;
        this.height = 20;
        this.value = 50;
        this.maxValue = 100;
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }
    buildDOM() {
        return this.buildTagDOM('progress', { class: ['component', 'progressbar'] });
    }
}

module.exports = {
    groupName: t('Bars'),
    classes: {
        ProgressBar
    }
}
