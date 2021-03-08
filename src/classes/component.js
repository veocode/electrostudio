const AttributesList = load.class('attributes');

class Component {

    static HTMLBuilder = load.instance('classes/htmlbuilder');

    static EventNames = {
        Focus: ['focus', 'blur'],
        Mouse: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover']
    };

    events = load.instance('classes/events');

    properties = {};
    propertyValues = {};

    eventNames = [];
    eventHandlerNames = {};

    $dom;

    constructor(presetPropertyValues = null, presetEventHandlers = null) {
        for (let trait of this.getTraits()) {
            this.addTrait(trait);
        }

        for (let eventName of this.getEventNames()) {
            this.addEventName(eventName);
            this.setEventHandler(eventName, null);
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
                    return true;
                }
                target.setPropertyValue(name, value);
                return true;
            }
        })

        componentProxy.setDefaults();

        if (presetPropertyValues) {
            componentProxy.setPropertyValues(presetPropertyValues);
        }

        if (presetEventHandlers) {
            componentProxy.setEventHandlers(presetEventHandlers);
        }

        return componentProxy;
    }

    getEventNames() {
        // Override in children
        return [];
    }

    addEventName(eventName) {
        this.eventNames.push(eventName);
    }

    hasEvent(eventName) {
        return this.eventNames.includes(eventName);
    }

    setEventHandler(eventName, handler) {
        this.eventHandlerNames[eventName] = handler;
    }

    setEventHandlers(handlers) {
        for (const [eventName, handlerName] of Object.entries(handlers)) {
            if (this.hasEvent(eventName)) {
                this.setEventHandler(eventName, handlerName);
            }
        }
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

        const currentValue = this.getPropertyValue(name);
        if (currentValue === value) { return; }

        value = this.properties[name].sanitize(value);

        if (!this.properties[name].validate(value)) {
            throw new errors.PropertyValidationException(name, value);
        }

        this.propertyValues[name] = value;

        this.events.emit('update', this);
    }

    hasProperty(name) {
        return name in this.properties;
    }

    buildDOM($) {
        // Override in children
    }

    buildTagDOM($, tag = 'div', startingAttributes = {}, ...$childrenDOM) {
        let $dom = $(`<${tag}></${tag}>`);
        $childrenDOM.forEach(($childDOM) => {
            $dom.append($childDOM);
        });

        const attributes = this.getTraitsAttributes(startingAttributes);
        attributes.add('id', this.name);
        attributes.applyToDOM($dom);

        return $dom;
    }

    getDOM($) {
        if (!this.$dom) {
            this.$dom = this.buildDOM($);
        }
        return this.$dom;
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

    getRecursiveChildrenList() {
        let childrenList = [];
        for (let childrenComponent of this.children) {
            childrenList.push(childrenComponent);
            if (childrenComponent.hasChildren()) {
                childrenList = childrenList.concat(childrenComponent.getRecursiveChildrenList());
            }
        }
        return childrenList;
    }

    getChildrenNames() {
        let names = [];
        for (let childrenComponent of this.children) {
            names.push(childrenComponent.name);
            if (childrenComponent.hasChildren()) {
                names = names.concat(childrenComponent.getChildrenNames());
            }
        }
        return names;
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

    buildDOM($, ...$childrenDOM) {
        // Override in children
    }

    getDOM($) {
        if (!this.$dom) {
            let $childrenDOM = [];
            for (let childrenComponent of this.getChildren()) {
                $childrenDOM.push(childrenComponent.getDOM($));
            }
            this.$dom = this.buildDOM($, ...$childrenDOM);
        }
        return this.$dom;
    }

}

module.exports = { Component, ContainerComponent };
