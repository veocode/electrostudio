class Property {

    name;
    isRequired;
    defaultValue = null;

    $input;

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

    getValidationError() {
        return t('Bad Value');
    }

    buildInput(value, callbacks) {
        this.$input = $('<input/>', { type: 'text', class: 'prop-input', value });

        this.$input.on('keydown', event => {
            if (event.keyCode == 13 && 'result' in callbacks) {
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

        return this.$input;
    }

    setInputValue(value) {
        if (this.$input) {
            this.$input.val(value);
        }
    }

}

module.exports = Property;
