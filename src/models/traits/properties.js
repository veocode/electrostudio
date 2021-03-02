class Property {

    name;
    isRequired;
    defaultValue = null;

    constructor(name, defaultValue = null, isRequired = true) {
        this.name = name;
        this.isRequired = isRequired;
        this.defaultValue = defaultValue;
    }

    sanitize(value) {
        return value;
    }

    validate(value) {
        return true;
    }

}

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
            super(name, defaultValue, isRequired)
            this.items = items
        }

        validate(value) {
            return this.items.includes(value);
        }
    }

}
