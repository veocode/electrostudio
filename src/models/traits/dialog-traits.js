const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    Dialogs: {

        TypeTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.ListProperty('type', ['none', 'info', 'error', 'question', 'warning'], 'info'),
                ]
            }
        },

        ButtonsTrait: class extends ComponentTrait {
            getProps() {
                return [
                    new Props.StringProperty('buttons', `${t('Ok')},${t('Cancel')}`, false)
                ]
            }
        },

    }

}
