const Property = load.class('property');

module.exports = {

    IntegerProperty: class extends Property {
        defaultValue = 0;

        sanitize(value) {
            return parseInt(value);
        }

        validate(value) {
            return Number.isInteger(value) && (!this.isRequired || value != 0);
        }
    },

    StringProperty: class extends Property {
        defaultValue = '';

        validate(value) {
            return !this.isRequired || value.length > 0;
        }
    },

    ListProperty: class extends Property {
        items = [];

        constructor(name, items, defaultValue = null, isRequired = true) {
            super(name, defaultValue, isRequired);
            this.items = items;
        }

        validate(value) {
            return this.items.includes(value);
        }
    },

    ColorProperty: class extends Property {
        defaultValue = '#FFFFFF';

        validate(value) {
            return (!this.isRequired || value.length > 0) && value.startsWith('#');
        }
    },

}
