const { ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class Form extends ContainerComponent {
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.Forms.ResizableTrait()
        ]);
    }
    setDefaults() {
        this.width = 640;
        this.height = 480;
        this.label = t('Form');
    }
    getRenderedHTML() {
        const attributes = this.getTraitsAttributes({ class: ['component', 'button'] });
        return Component.HTMLBuilder.make('button', attributes, '<i class="fa fa-download"></i> ' + this.label);
    }
}

module.exports = {
    Form
}