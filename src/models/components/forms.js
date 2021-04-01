const { ContainerComponent } = load.class('component');
const AttributesList = load.class('attributes');
const Traits = load.models.traits();

class Form extends ContainerComponent {

    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.TitleTrait(),
            new Traits.SizeTrait(),
            new Traits.PositionTrait(),
            new Traits.FormTrait()
        ]);
    }

    setDefaults() {
        this.width = 640;
        this.height = 480;
        this.left = 400;
        this.top = 120;
        this.center = true;
        this.title = t('Form');
    }

    buildDOM(...$childrenDOM) {
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
