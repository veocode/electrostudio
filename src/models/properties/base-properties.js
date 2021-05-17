const Property = load.class('property');

module.exports = {

    BooleanProperty: class extends Property {
        defaultValue = true;

        constructor(name, defaultValue = null, isRequired = true) {
            super(name, defaultValue, isRequired);
            if (defaultValue !== null) {
                this.defaultValue = defaultValue;
            }
        }

        sanitize(value) {
            if (value === 'true') { return true; }
            if (value === 'false') { return false; }
            return Boolean(value);
        }

        makeInputInstance(value) {
            const { InputFactory } = load.class('factories');
            return InputFactory.Create('ListInput', value, ['true', 'false']);
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

    FloatProperty: class extends Property {
        defaultValue = 0.0;

        sanitize(value) {
            return parseFloat(value);
        }

        validate(value) {
            return Number.isInteger(value) || (+value === value && (!isFinite(value) || !!(value % 1)))
        }
    },

    RelativeIntegerProperty: class extends Property {
        defaultValue = 0;

        isPercents(value) {
            return value && value.match(/^[0-9]+%$/);
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

        makeInputInstance(value) {
            const { InputFactory } = load.class('factories');
            return InputFactory.Create('ListInput', value, this.items);
        }
    },

    ColorProperty: class extends Property {
        defaultValue = 'auto';

        validate(value) {
            return (
                (!this.isRequired && value == '') ||
                ['auto', 'none'].includes(value) ||
                value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
            );
        }

        makeInputInstance(value) {
            const { InputFactory } = load.class('factories');
            return InputFactory.Create('ColorInput', value);
        }
    },

}
