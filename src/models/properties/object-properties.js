const Property = load.class('property');

module.exports = {

    ObjectProperty: class extends Property {
        defaultValue = {};

        sanitize(value) {
            return value || {};
        }

        validate(value) {
            return typeof (value) === 'object';
        }
    },

    ObjectListProperty: class extends Property {
        defaultValue = [];

        #fieldSchema = [];

        constructor(name, fieldSchema, defaultValue = null, isRequired = true) {
            super(name, defaultValue, isRequired);
            this.#fieldSchema = fieldSchema;
        }

        sanitize(value) {
            return value || [];
        }

        validate(value) {
            return typeof (value) === 'object' && Array.isArray(value);
        }

        makeInputInstance(value) {
            console.log('makeInput', value);
            const { InputFactory } = load.class('factories');
            const input = InputFactory.Create('ObjectListInput', value);
            input.setFieldSchema(this.#fieldSchema);
            return input;
        }
    },

}
