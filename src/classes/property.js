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

module.exports = Property;
