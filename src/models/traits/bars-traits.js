const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    ProgressBarTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty('mode', ['determinate', 'indeterminate'], 'indeterminate'),
                new Props.IntegerProperty('value'),
                new Props.IntegerProperty('minValue'),
                new Props.IntegerProperty('maxValue'),
            ]
        }
    }

}
