const Loader = require("./loader");

class Component {

    static htmlBuilder = load.node('html-creator');

    properties = {};
    propertyValues = {};

    constructor() {
        for (let trait of this.getTraits()) {
            this.addTrait(trait);
        }

        return new Proxy(this, {
            get(target, name) {
                if (name in target) {
                    return target[name];
                }
                return target.getPropertyValue(name);
            },
            set(target, name, value) {
                if (name in target) {
                    target[name] = value;
                }
                target.setPropertyValue(name, value);
                return true;
            }
        })
    }

    getTraits() {
        return [];
    }

    addTrait(trait) {
        for (let prop of trait.getProps()) {
            this.properties[prop.name] = prop;
            this.propertyValues[prop.name] = prop.defaultValue;
        }
    }

    getProperties() {
        return this.properties;
    }

    getProperty(name) {
        return this.hasProperty(name) ? this.properties[name] : undefined;
    }

    getPropertyValue(name) {
        if (!this.hasProperty(name)) {
            throw new errors.PropertyInvalidException(name);
        }

        return this.propertyValues[name];
    }

    getPropertiesValues() {
        return this.propertyValues;
    }

    setPropertyValue(name, value) {
        if (!this.hasProperty(name)) {
            throw new errors.PropertyInvalidException(name);
        }

        value = this.properties[name].sanitize(value);

        if (!this.properties[name].validate(value)) {
            throw new errors.PropertyValidationException(name, value);
        }

        this.propertyValues[name] = value;
    }

    hasProperty(name) {
        return name in this.properties;
    }

    getRenderedHTML() {
        return '';
    }

    getRenderedEditorHTML() {
        return this.getRenderedHTML();
    }

    hasChildren() {
        return false;
    }

}

class ContainerComponent extends Component {

    children = [];

    getRenderedChildrenHTML() {
        if (!this.children.length) {
            return '';
        }
        let childrenHTML = '';
        for (let childrenComponent of this.children) {
            childrenHTML += childrenComponent.getRenderedHTML();
        }
        return childrenHTML;
    }

    getRenderedChildrenEditorHTML() {
        if (!this.children.length) {
            return '';
        }
        let childrenHTML = '';
        for (let childrenComponent of this.children) {
            childrenHTML += childrenComponent.getRenderedEditorHTML();
        }
        return childrenHTML;
    }

    addChildren(component) {
        this.children.push(component);
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return this.children.length > 0;
    }

}

module.exports = { Component, ContainerComponent };

