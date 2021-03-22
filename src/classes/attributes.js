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
        if (this.#attributes[name].includes(value)) {
            return;
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

    applyToDOM($dom) {
        for (let [name, value] of Object.entries(this.#attributes)) {
            if (Array.isArray(value)) {
                value = value.join(' ');
            }
            $dom.attr(name, value);
        }
        return $dom;
    }

}

module.exports = AttributesList;