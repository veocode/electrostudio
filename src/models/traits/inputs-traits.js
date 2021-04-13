const ComponentTrait = load.class('trait');
const Props = load.models.properties();

module.exports = {

    InputTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty('placeholder', '', false),
                new Props.ListProperty('type', [
                    'text',
                    'number',
                    'password',
                    'email',
                    'range',
                    'color',
                    'date',
                    'datetime',
                    'datetime-local',
                    'search',
                    'tel',
                    'time',
                    'url',
                    'month',
                    'week'
                ], 'text'),
                new Props.StringProperty('value', '', false),
            ]
        }

        appendAttributes(attributes, values) {
            values.placeholder && attributes.add('placeholder', values.placeholder);
            values.type && attributes.add('type', values.type);
            values.value && attributes.add('value', values.value);
        }
    }

}
