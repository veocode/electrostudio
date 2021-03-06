const Property = load.class('property');

module.exports = {

    BooleanProperty: class extends Property {
        defaultValue = true;

        sanitize(value) {
            if (value === 'true') { return true; }
            if (value === 'false') { return false; }
            return Boolean(value);
        }
    },

    IntegerProperty: class extends Property {
        defaultValue = 0;

        sanitize(value) {
            return parseInt(value);
        }

        validate(value) {
            return Number.isInteger(value);
        }
    },

    RelativeIntegerProperty: class extends Property {
        defaultValue = 0;

        isPercents(value) {
            return value.match(/^[0-9]+%$/);
        }

        sanitize(value) {
            if (typeof (value) == 'string' && this.isPercents(value)) {
                return value;
            }
            return parseInt(value);
        }

        validate(value) {
            return (Number.isInteger(value) || this.isPercents(value)) && (!this.isRequired || value != 0);
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
