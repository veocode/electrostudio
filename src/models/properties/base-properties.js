const Property = load.class('property');

module.exports = {

    BooleanProperty: class extends Property {
        defaultValue = true;

        sanitize(value) {
            if (value === 'true') { return true; }
            if (value === 'false') { return false; }
            return Boolean(value);
        }

        buildInput(value, callbacks) {
            this.$input = $('<select/>', { class: 'prop-input prop-list' });

            for (let item of ['true', 'false']) {
                $('<option/>', { value: item }).html(item).appendTo(this.$input);
            }

            this.$input.on('change', event => {
                if ('result' in callbacks) {
                    const value = this.sanitize(this.$input.val());
                    if (!this.validate(value)) {
                        if ('error' in callbacks) {
                            callbacks.error(this.getValidationError());
                        }
                        return;
                    }
                    this.setInputValue(value);
                    callbacks.result(value);
                }
            });

            this.setInputValue(value);
            return this.$input;
        }

        setInputValue(value) {
            if (this.$input) {
                this.$input.val(value ? 'true' : 'false');
            }
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

        buildInput(value, callbacks) {
            this.$input = $('<select/>', { class: 'prop-input prop-list' });

            for (let item of this.items) {
                $('<option/>', { value: item }).html(item).appendTo(this.$input);
            }

            this.$input.on('change', event => {
                if ('result' in callbacks) {
                    const value = this.sanitize(this.$input.val());
                    if (!this.validate(value)) {
                        if ('error' in callbacks) {
                            callbacks.error(this.getValidationError());
                        }
                        return;
                    }
                    callbacks.result(value);
                }
            });

            this.setInputValue(value);
            return this.$input;
        }
    },

    ColorProperty: class extends Property {
        defaultValue = '#FFFFFF';

        validate(value) {
            // 4 - #FFF
            // 7 - #FFFFFF
            return (!this.isRequired || [4, 7].includes(value.length)) && value.startsWith('#');
        }
    },

}
