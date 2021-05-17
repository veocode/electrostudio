class Property {

    name;
    isRequired;
    defaultValue = null;

    #input;

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

    getInput(value) {
        if (this.#input) {
            return this.#input;
        }

        this.#input = this.makeInputInstance(value);
        return this.#input;
    }

    makeInputInstance(value) {
        const { InputFactory } = load.class('factories');
        return InputFactory.Create('StringInput', value);
    }

}

module.exports = Property;
