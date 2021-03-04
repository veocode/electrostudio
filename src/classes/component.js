const AttributesList = load.class('attributes');

class Component {

    static HTMLBuilder = load.instance('classes/htmlbuilder');

    properties = {};
    propertyValues = {};

    constructor(presetPropertyValues = null) {
        for (let trait of this.getTraits()) {
            this.addTrait(trait);
        }

        const componentProxy = new Proxy(this, {
            get(target, name) {
                if (name in target) {
                    return target[name];
                }
                return target.getPropertyValue(name);
            },
            set(target, name, value) {
                if (name in target) {
                    target[name] = value;
                    return;
                }
                target.setPropertyValue(name, value);
                return true;
            }
        })

        componentProxy.setDefaults();

        if (presetPropertyValues) {
            componentProxy.setPropertyValues(presetPropertyValues);
        }

        return componentProxy;
    }

    getTraits() {
        return [];
    }

    setDefaults() {
        // Override in children to set default property values
    }

    getTraitsAttributes(startingAttributes = {}) {
        let attributes = new AttributesList(startingAttributes);
        for (let trait of this.getTraits()) {
            trait.appendAttributes(attributes, this.propertyValues);
        }
        return attributes;
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

    setPropertyValues(values) {
        for (const [name, value] of Object.entries(values)) {
            if (this.hasProperty(name)) {
                this.setPropertyValue(name, value);
            }
        }
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

    getSchema() {
        let schema = {
            className: this.constructor.name,
            properties: this.propertyValues,
        }
        return schema;
    }

    setSchema(schema) {

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

    addChildren(...components) {
        for (let component of components) {
            this.children.push(component);
        }
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return this.children.length > 0;
    }

    getSchema() {
        let childrenSchemas = [];

        if (this.hasChildren()) {
            for (let childrenComponent of this.getChildren()) {
                childrenSchemas.push(childrenComponent.getSchema());
            }
        }

        let schema = super.getSchema();

        if (childrenSchemas.length > 0) {
            schema.children = childrenSchemas;
        }

        return schema;
    }

}

module.exports = { Component, ContainerComponent };