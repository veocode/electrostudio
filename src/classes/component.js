const AttributesList = load.class('attributes');

class Component {

    static EventNames = {
        Focus: ['focus', 'blur'],
        Mouse: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover']
    };

    isVirtual = false;

    events = load.instance('classes/eventmanager');

    properties = {};
    propertyValues = {};

    eventNames = [];
    eventHandlerNames = {};

    $dom;
    proxy;

    constructor(presetPropertyValues = null, presetEventHandlers = null) {
        for (let trait of this.getTraits()) {
            this.addTrait(trait);
        }

        for (let eventName of this.getEventNames()) {
            this.addEventName(eventName);
            this.setEventHandler(eventName, null);
        }

        this.proxy = new Proxy(this, {
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

        this.proxy.setDefaults();

        if (presetPropertyValues) {
            this.proxy.setPropertyValues(presetPropertyValues);
        }

        if (presetEventHandlers) {
            this.proxy.setEventHandlers(presetEventHandlers);
        }

        return this.proxy;
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

    getEventHandlerNames() {
        return this.eventHandlerNames;
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
        this.events.emit('updated', this.proxy);
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

    rebuildDOM($) {
        this.$dom = this.buildDOM($);
    }

    getDOM($) {
        if (!this.$dom) {
            this.rebuildDOM($);
        }
        return this.$dom;
    }

    resetCachedDOM() {
        this.$dom = null;
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
        this.proxy.setPropertyValues(schema.properties);
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
        this.events.emit('children-added', this.proxy, ...components);
    }

    getChildren() {
        return this.children;
    }

    removeChildren() {
        this.children = [];
        this.resetCachedDOM();
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

    setSchema(schema) {
        super.setSchema(schema);
        if (schema.children) {

            const { ComponentFactory } = load.class('factories');

            for (let childrenSchema of schema.children) {
                const childrenComponent = ComponentFactory.Create(childrenSchema.className);
                childrenComponent.setSchema(childrenSchema);
                this.addChildren(childrenComponent);
            }

        }
    }

    buildDOM($, ...$childrenDOM) {
        // Override in children
    }

    resetCachedDOM() {
        super.resetCachedDOM();
        for (let childrenComponent of this.getChildren()) {
            childrenComponent.resetCachedDOM();
        }
    }

    rebuildDOM($) {
        let $childrenDOM = [];
        for (let childrenComponent of this.getChildren()) {
            if (childrenComponent.isVirtual) { continue; }
            $childrenDOM.push(childrenComponent.getDOM($));
        }
        this.$dom = this.buildDOM($, ...$childrenDOM);
    }

    getDOM($) {
        if (!this.$dom) {
            this.rebuildDOM($);
        }
        return this.$dom;
    }

}

module.exports = {
    Component,
    ContainerComponent
};
