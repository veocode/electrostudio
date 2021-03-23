const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class Panel extends ContainerComponent {
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.BackgroundColorTrait(),
        ]);
    }
    setDefaults() {
        this.width = this.height = 200;
        this.backgroundColor = '#252525';
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }
    buildDOM(...$childrenDOM) {
        const $wrapper = this.buildInnerTagDOM('div', { class: ['panel-body', 'container'] }, ...$childrenDOM)
        return this.buildTagDOM('div', { class: ['component', 'panel'] }, $wrapper);
    }
}

class ToolPanel extends Panel {
    buildDOM(...$childrenDOM) {
        return this.buildTagDOM('div', { class: ['component', 'panel', 'toolpanel', 'container'] }, ...$childrenDOM);
    }
}

module.exports = {
    groupName: t('Panels'),
    classes: {
        Panel,
        ToolPanel
    }
}
