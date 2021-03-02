class AttributesList {

    #attributes;

    constructor(startingAttributes = {}) {
        this.#attributes = startingAttributes;
    }

    add(name, value) {
        if (!(name in this.#attributes)) {
            this.#attributes[name] = [];
        }
        if (name == 'style' && !value.endsWith(';')) {
            value += ';';
        }
        this.#attributes[name].push(value);
    }

    getHTML() {
        let attributesString = [];
        for (let [name, value] of Object.entries(this.#attributes)) {
            if (Array.isArray(value)) {
                value = value.join(' ');
            }
            attributesString.push(`${name}="${value}"`)
        }
        return attributesString.length ? ' ' + attributesString.join(' ') : '';
    }

}

module.exports = AttributesList;