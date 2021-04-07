const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    TabsTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty('activeTabIndex'),
            ]
        }
    }

}
