const Props = load.model('traits/properties');
const ComponentTrait = load.class('trait');

module.exports = {

    PositionTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty("left"),
                new Props.IntegerProperty("top"),
            ]
        }
        appendAttributes(attributes, values) {
            values.left == 0 || attributes.add('style', `left: ${values.left}px`);
            values.top == 0 || attributes.add('style', `top: ${values.top}px`);
        }
    },

    SizeTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty("width"),
                new Props.IntegerProperty("height"),
            ]
        }
        appendAttributes(attributes, values) {
            values.width == 0 || attributes.add('style', `width: ${values.width}px`);
            values.height == 0 || attributes.add('style', `height: ${values.height}px`);
        }
    },

    NameTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty("name"),
            ]
        }
        appendAttributes(attributes, values) {
            if (values.name) {
                attributes.add('id', values.name);
            }
        }
    },

    LabelTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty("label", 'Default', false),
            ]
        }
    },

    AlignmentTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty("alignment", ['none', 'client', 'top', 'bottom', 'left', 'right'], 'none'),
            ]
        }
        appendAttributes(attributes, values) {
            if (values.alignment != 'none') {
                attributes.add('class', `align-${values.alignment}`);
            }
        }
    }

}
