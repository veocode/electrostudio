const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    ListBoxTrait: class extends ComponentTrait {

        #fieldSchema = [];

        constructor(fieldSchema = []) {
            super();
            this.#fieldSchema = fieldSchema;
        }

        getProps() {
            return [
                new Props.ObjectListProperty('items', this.#fieldSchema),
            ]
        }

    }

}
