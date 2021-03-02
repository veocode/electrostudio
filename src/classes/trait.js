class ComponentTrait {

    defaults = {};

    constructor(defaultPropValues = {}) {
        this.defaults = defaultPropValues;
    }

    getProps() {
        return [];
    }

    getDefault(propName) {

    }

    appendAttributes(attributes, values = {}) {

    }

}

module.exports = ComponentTrait;