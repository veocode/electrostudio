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
        $inputGroup;

        validate(value) {
            return (
                (!this.isRequired && value == '') ||
                ['auto', 'none'].includes(value) ||
                value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
            );
        }

        buildInput(value, callbacks) {
            this.$inputGroup = $('<div/>', { class: 'prop-input-group' });

            this.$input = $('<input/>', { class: 'prop-input', type: 'text', value }).appendTo(this.$inputGroup);
            this.$colorInput = $('<input/>', { class: 'prop-input-color', type: 'color', value }).appendTo(this.$inputGroup);

            const inputChangeCallback = (newValue) => {
                if ('result' in callbacks) {
                    newValue = this.sanitize(newValue);
                    if (!this.validate(newValue)) {
                        if ('error' in callbacks) {
                            callbacks.error(this.getValidationError());
                        }
                        return;
                    }
                    this.setInputValue(newValue);
                    callbacks.result(newValue);
                }
            }

            this.$input.on('change', event => {
                inputChangeCallback(this.$input.val());
            });

            this.$colorInput.on('change', event => {
                inputChangeCallback(this.$colorInput.val());
            });

            this.setInputValue(value);
            return this.$inputGroup;
        }

        setInputValue(value) {
            if (this.$inputGroup) {
                this.$input.val(value);
                this.$colorInput.val(value);
            }
        }
    },

}
