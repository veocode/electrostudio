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
            new Traits.FormTrait(),
            new Traits.BackgroundColorTrait()
        ]);
    }

    setDefaults() {
        this.width = 640;
        this.height = 480;
        this.left = 400;
        this.top = 120;
        this.center = true;
        this.modal = false;
        this.title = t('Form');
        this.backgroundColor = '#5B5B5B';
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

    getDesignerActions() {
        return {
            getComponentScheme: {
                title: t('Get Scheme'),
                icon: 'cog'
            }
        };
    }

    getComponentScheme() {
        const beautifier = load.node('js-beautify');
        const util = load.node('util');
        const schema = this.getSchema();
        const propJS = util.inspect(schema.properties, {
            depth: Infinity,
            maxArrayLength: Infinity,
            maxStringLength: Infinity,
            breakLength: Infinity
        });
        const chidlrenJS = util.inspect(schema.children, {
            depth: Infinity,
            maxArrayLength: Infinity,
            maxStringLength: Infinity,
            breakLength: Infinity
        });
        console.log(beautifier.js(propJS));
        console.log(beautifier.js(chidlrenJS));
    }

}

module.exports = {
    groupName: null,
    classes: {
        Form
    }
}
