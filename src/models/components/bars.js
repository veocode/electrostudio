const { Component } = load.class('component');
const Traits = load.models.traits();
const Utils = load.class('utils');

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
            new Traits.ForegroundColorTrait(),
            new Traits.BackgroundColorTrait(),
            new Traits.MetaDataTrait(),
        ]);
    }
    setDefaults() {
        this.width = 300;
        this.height = 20;
        this.value = 50;
        this.maxValue = 100;
        this.minValue = 0;
        this.foregroundColor = '#3498DB';
        this.backgroundColor = '#2B2B2B';
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }
    getProgressPercent() {
        return Utils.percent(this.value, this.maxValue, this.minValue);
    }

    buildDOM() {
        const $bar = $('<div/>', { class: 'bar' });
        $bar.css('width', `${this.getProgressPercent()}%`);
        $bar.css('background-color', this.foregroundColor);
        return this.buildTagDOM('div', { class: ['component', 'progressbar', this.mode] }, $bar);
    }
}

module.exports = {
    groupName: t('Bars'),
    classes: {
        ProgressBar
    }
}
