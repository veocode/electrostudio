const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    Layouts: {

        OrientationTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.ListProperty('orientation', ['row', 'column'], 'row'),
                ]
            }
            appendAttributes(attributes, values) {
                attributes.add('class', `orientation-${values.orientation}`);
            }
        },

        OrderIndexTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.IntegerProperty('orderIndex'),
                ]
            }
            appendAttributes(attributes, values) {
                attributes.add('data-order-index', values.orderIndex);
            }
        },

        WeightTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.FloatProperty('weight'),
                ]
            }
            appendAttributes(attributes, values) {
                attributes.add('data-weight', values.weight);
            }
        },

        FixedSizeTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.IntegerProperty('fixedSize'),
                ]
            }
            appendAttributes(attributes, values, paneComponent) {
                if (!values.fixedSize) { return; }
                let sizeAttr = 'width';

                if (paneComponent && paneComponent.parent) {
                    sizeAttr = paneComponent.parent.orientation == 'column' ? 'height' : 'width';
                }

                attributes.add('style', `${sizeAttr}: ${values.fixedSize}px`);
                attributes.add('style', `min-${sizeAttr}: ${values.fixedSize}px`);
                attributes.add('style', `max-${sizeAttr}: ${values.fixedSize}px`);
            }
        },

    }

}
