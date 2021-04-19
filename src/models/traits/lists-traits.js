const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    ListBoxTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ObjectProperty('schema'),
                new Props.ObjectListProperty('items'),
            ]
        }
    }

}
