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
    getRenderedHTML() {
        const attributes = this.getTraitsAttributes({ class: ['component', 'panel'] });
        const content = this.getRenderedChildrenHTML();
        return Component.HTMLBuilder.make('div', attributes, content);
    }
}

class ToolPanel extends Panel {
    getRenderedHTML() {
        const attributes = this.getTraitsAttributes({ class: ['component', 'panel'] });
        const content = this.getRenderedChildrenHTML();
        attributes.add('class', 'toolpanel');
        return Component.HTMLBuilder.make('div', attributes, content);
    }
}

module.exports = {
    Panel,
    ToolPanel
}
