const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    ListBoxTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ObjectListProperty('fields'),
                new Props.ObjectListProperty('items'),
            ]
        }
    }

}
