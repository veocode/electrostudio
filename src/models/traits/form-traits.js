const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    FormTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.BooleanProperty('center'),
                new Props.BooleanProperty('resizable'),
                new Props.BooleanProperty('minimizable'),
                new Props.BooleanProperty('maximizable'),
            ]
        }
    }

}
