const AttributesList = load.class('attributes');

class Component {

    static EventNames = {
        Focus: ['focus', 'blur'],
        Mouse: ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover'],
        Keyboard: ['keyup', 'keydown', 'keypress'],
        Input: ['change']
    };

    isVirtual = false;

    events = load.instance('classes/eventmanager');

    properties = {};
    propertyValues = {};

    eventNames = [];
    eventHandlerNames = {};

    parent;
    $dom;
    proxy;
    meta = {};

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

    isContainer() {
        return false;
    }

    getEventNames() {
        // Override in children
        return [];
    }

    getDesignerActions() {
        // Override in children
        return {};
    }

    static getIcon() {
        // Override in children
        return 'bolt';
    }

    static getTitle() {
        return this.name;
    }

    static isInternal() {
        return false;
    }

    callAction(methodName, ...actionArgs) {
        if (methodName in this) {
            return this[methodName](...actionArgs);
        }
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

    getDefaultEventName() {
        return this.eventNames[0] ?? 'click';
    }

    registerEventHandler(eventName, handlerCallback) {
        const $dom = this.getDOM();
        $dom.on(eventName, handlerCallback);
    }

    getTraits() {
        return [];
    }

    getTraitsAttributes(startingAttributes = {}) {
        let attributes = new AttributesList(startingAttributes);
        for (let trait of this.getTraits()) {
            trait.appendAttributes(attributes, this.propertyValues, this);
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

        this.assignPropertyValue(name, value);

        if (this.isRebuildOnPropertyUpdate(name, value)) {
            this.events.emit('updated', this.proxy);
        }

        if (this.parent && this.isRebuildParentOnPropertyUpdate(name, value)) {
            this.parent.events.emit('updated', this.parent);
        }
    }

    assignPropertyValue(name, value) {
        this.propertyValues[name] = value;
    }

    hasProperty(name) {
        return name in this.properties;
    }

    setDefaults() {
        // Override in children to set default property values
    }

    buildDOM() {
        // Override in children
    }

    buildInnerTagDOM(tag = 'div', tagAttributes = {}, ...$childrenDOM) {
        const $dom = $(`<${tag}></${tag}>`);
        $childrenDOM.forEach(($childDOM) => {
            $dom.append($childDOM);
        });
        if (tagAttributes && Object.keys(tagAttributes).length) {
            const attributes = new AttributesList(tagAttributes);
            attributes.applyToDOM($dom);
        }
        return $dom;
    }

    buildTagDOM(tag = 'div', startingAttributes = {}, ...$childrenDOM) {
        const $dom = this.buildInnerTagDOM(tag, {}, ...$childrenDOM);
        const attributes = this.getTraitsAttributes(startingAttributes);
        attributes.add('id', this.name);
        attributes.applyToDOM($dom);
        return $dom;
    }

    rebuildDOM() {
        this.$dom = this.buildDOM();
    }

    onFirstTimeCreated(window) {
        // Override in children
    }

    onAfterBuild() {
        // Override in children
    }

    onAfterRebuild() {
        // Override in children
    }

    getDOM() {
        if (!this.$dom) {
            this.rebuildDOM();
            this.onAfterBuild();
        }
        return this.$dom;
    }

    show() {
        this.getDOM().show();
    }

    hide() {
        this.getDOM().hide();
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
            properties: Object.assign({}, this.propertyValues),
            events: Object.assign({}, this.eventHandlerNames)
        }
        return schema;
    }

    setSchema(schema, form) {
        this.proxy.setPropertyValues(schema.properties);
        if (schema.events) {
            this.proxy.setEventHandlers(schema.events);
        }
    }

    isResizable() {
        for (let trait of this.getTraits()) {
            if (!trait.isAllowComponentResizing(this.propertyValues)) {
                return false;
            }
        }
        return true;
    }

    isDraggable() {
        for (let trait of this.getTraits()) {
            if (!trait.isAllowComponentDragging(this.propertyValues)) {
                return false;
            }
        }
        return true;
    }

    setMeta(key, value) {
        this.meta[key] = value;
    }

    getMeta(key, defaultValue = null) {
        return key in this.meta ? this.meta[key] : defaultValue;
    }

    deleteMeta(key) {
        if (key in this.meta) {
            delete this.meta[key];
        }
    }

    isRebuildOnPropertyUpdate(updatedPropertyName, value) {
        return true;
    }

    isRebuildParentOnPropertyUpdate(updatedPropertyName, value) {
        return false;
    }

    isRebuildChildrenOnPropertyUpdate(updatedPropertyName, value) {
        return false;
    }

}

class ContainerComponent extends Component {

    children = [];

    isContainer() {
        return true;
    }

    setPropertyValue(name, value) {
        const currentValue = this.getPropertyValue(name);
        if (currentValue === value) { return; }

        super.setPropertyValue(name, value);

        if (this.hasChildren() && this.isRebuildChildrenOnPropertyUpdate(name, value)) {
            for (let childrenComponent of this.children) {
                childrenComponent.events.emit('updated', childrenComponent);
            }
        }
    }

    addChildren(...components) {
        for (let component of components) {
            this.children.push(component);
            component.parent = this;
        }
        this.events.emit('children-added', this.proxy, ...components);
    }

    getChildren() {
        return this.children;
    }

    removeChildren() {
        if (!this.children.length) { return; }
        this.events.emit('children-removed', this.proxy, ...this.children);
        this.children = [];
    }

    deleteChildren(childrenComponent) {
        this.children = this.children.filter(component => component !== childrenComponent);
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
        if (!this.children) {
            this.children = [];
        }
        return this.children.length > 0;
    }

    getChildrenSchema() {
        let childrenSchemas = [];
        for (let childrenComponent of this.getChildren()) {
            childrenSchemas.push(childrenComponent.getSchema());
        }
        return childrenSchemas;
    }

    getSchema(isWithChildren = true) {
        let schema = super.getSchema();

        if (isWithChildren && this.hasChildren()) {
            schema.children = this.getChildrenSchema();
        }

        return schema;
    }

    setSchema(schema, form) {
        super.setSchema(schema, form);
        if (schema.children) {

            const { ComponentFactory } = load.class('factories');

            for (let childrenSchema of schema.children) {
                const childrenComponent = form.createComponent(childrenSchema.className);
                childrenComponent.setSchema(childrenSchema, form);
                this.addChildren(childrenComponent);
            }

        }
    }

    rebuildDOM() {
        let $childrenDOM = [];
        for (let childrenComponent of this.getChildren()) {
            if (childrenComponent.isVirtual) { continue; }
            $childrenDOM.push(childrenComponent.getDOM());
        }
        this.$dom = this.buildDOM(...$childrenDOM);
    }

    buildDOM(...$childrenDOM) {
        // Override in children
    }

    resetCachedDOM() {
        super.resetCachedDOM();
        this.resetChildrenCachedDOM();
    }

    resetChildrenCachedDOM() {
        for (let childrenComponent of this.getChildren()) {
            childrenComponent.resetCachedDOM();
        }
    }

}

module.exports = {
    Component,
    ContainerComponent
};
