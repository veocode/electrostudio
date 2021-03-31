const { ComponentFactory } = load.class('factories');

class Form {

    events = load.instance('classes/eventmanager');
    ipc = load.instance('classes/formipc', this);

    #name;
    #formComponent;
    #components = [];

    #componentsCountByClass = {};
    #isListeningComponentEvents = false;

    getName() {
        if (!this.#name) {
            this.#name = this.getSchema().name;
        }
        return this.#name;
    }

    getSchema() {
        // Override in children
    }

    getChildrenSchema() {
        if (!this.#formComponent) { return []; }
        return this.#formComponent.getSchema().children;
    }

    getComponent() {
        return this.#formComponent;
    }

    build() {
        this.buildForm();
        this.buildComponents();
        this.#isListeningComponentEvents = true;
    }

    buildForm() {
        this.#formComponent = ComponentFactory.Create('Form', this.getSchema());
    }

    replaceFormComponent(newFormComponent) {
        this.#formComponent = newFormComponent;
    }

    buildComponents() {
        // Override in children
    }

    buildComponentsFromSchemaList(schemaList) {
        this.#isListeningComponentEvents = false;
        let children = [];
        for (let childrenSchema of schemaList) {
            const childrenComponent = this.createComponent(childrenSchema.className);
            childrenComponent.setSchema(childrenSchema, this);
            children.push(childrenComponent);
        }
        if (children.length) {
            this.removeChildren();
            this.addChildren(...children);
        }
        this.#isListeningComponentEvents = true;
    }

    getDOM() {
        return this.#formComponent ? this.#formComponent.getDOM() : null;
    }

    createWindow() {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'createWindow'
        });
    }

    setSize(width, height) {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'setSize',
            methodArgs: [width, height]
        });
    }

    setResizable(isResizable) {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'setResizable',
            methodArgs: [isResizable]
        });
    }

    setMinimizable(isMinimizable) {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'setMinimizable',
            methodArgs: [isMinimizable]
        });
    }

    setMaximizable(isMaximizable) {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'setMaximizable',
            methodArgs: [isMaximizable]
        });
    }

    addChildren(...components) {
        this.#formComponent.addChildren(...components);

        let childrenComponents = this.#formComponent.getRecursiveChildrenList();
        let added = [];

        for (let childrenComponent of childrenComponents) {
            if (!this.#components.includes(childrenComponent)) {
                added.push(childrenComponent);
            }
        }

        this.registerChildren(...added);
    }

    deleteChildren(childrenComponent) {
        if (childrenComponent.parent) {
            childrenComponent.parent.deleteChildren(childrenComponent);
        }
        this.#formComponent.deleteChildren(childrenComponent);
        this.#components = this.#components.filter(component => component !== childrenComponent);
    }

    removeChildren() {
        this.#formComponent.removeChildren();
    }

    registerChildren(...components) {
        for (let childrenComponent of components) {

            childrenComponent.events.setListenCondition(() => this.#isListeningComponentEvents);

            childrenComponent.events.on('updated', (component) => {
                this.events.emit('component:updated', component);
            });

            childrenComponent.events.on('children-added', (component, ...addedChildren) => {
                this.registerChildren(...addedChildren);
                this.events.emit('component:children-added', component, ...addedChildren);
            });

            childrenComponent.events.on('children-removed', (component, ...removedChildren) => {
                this.unregisterChildren(...removedChildren);
                this.events.emit('component:children-removed', component, ...removedChildren);
            });

        }

        this.#components = this.#components.concat(components);
    }

    unregisterChildren(...components) {
        for (let childrenComponent of components) {
            const index = this.#components.indexOf(childrenComponent);
            if (index < 0) { continue; }

            childrenComponent.events.off();
            this.#components = this.#components.splice(index, 1);
        }
    }

    getComponentNames() {
        return this.#formComponent.getChildrenNames();
    }

    getComponentsList() {
        return this.#components;
    }

    createComponent(className, ...componentArgs) {
        const component = ComponentFactory.Create(className, ...componentArgs);

        if (!component.name) {
            component.name = this.getNextComponentName(className);
        }

        if (this.isComponentNameExists(component.name)) {
            throw new errors.ComponentNameAlreadyExists(component.name, className);
        }

        className in this.#componentsCountByClass ?
            this.#componentsCountByClass[className] += 1 :
            this.#componentsCountByClass[className] = 1;

        return component;
    }

    getComponentCountByClass(className) {
        return className in this.#componentsCountByClass ?
            this.#componentsCountByClass[className] :
            0;
    }

    isComponentNameExists(name) {
        for (let existComponent of this.#components) {
            if (existComponent.name == name) {
                return true;
            }
        }
        return false;
    }

    getNextComponentName(className) {
        return `${className}${this.getComponentCountByClass(className) + 1}`;
    }

    on(eventName, callback) {
        return this.ipc.on(eventName, callback);
    }

    emit(eventName, payload) {
        return this.ipc.emit(eventName, payload || {});
    }

    send(eventName, payload) {
        return this.ipc.send(eventName, payload || {});
    }

}

module.exports = Form;
