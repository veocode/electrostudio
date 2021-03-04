const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    Forms: {

        ResizableTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.BooleanProperty('resizable'),
                    new Props.BooleanProperty('minimizable'),
                    new Props.BooleanProperty('maximizable'),
                ]
            }
        },

    }

}
