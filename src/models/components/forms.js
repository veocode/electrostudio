const { ContainerComponent } = load.class('component');
const AttributesList = load.class('attributes');
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

    buildDOM($, ...$childrenDOM) {
        const attributes = new AttributesList({ 'class': 'form-body' });
        let $dom = $('<div></div>');
        $childrenDOM.forEach(($childDOM) => {
            $dom.append($childDOM);
        });
        attributes.applyToDOM($dom);
        return $dom;
    }

}

module.exports = {
    groupName: null,
    classes: {
        Form
    }
}
