const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    ProgressBarTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty('mode', ['determinate', 'indeterminate'], 'determinate'),
                new Props.IntegerProperty('value'),
                new Props.IntegerProperty('maxValue'),
            ]
        }
        appendAttributes(attributes, values) {
            if (values.mode == 'indeterminate') {
                return;
            }
            if (values.maxValue && values.value > values.maxValue) {
                values.value = values.maxValue;
            }
            attributes.add('value', values.value);
            attributes.add('max', values.maxValue);
        }
    }

}
