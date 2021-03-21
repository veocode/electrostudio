class Form {

    static Components = load.componentClasses();

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

    build() {
        this.buildForm();
        this.buildComponents();
        this.#isListeningComponentEvents = true;
    }

    buildForm() {
        this.#formComponent = new Form.Components.Form(this.getSchema());
    }

    buildComponents() {
        // Override in children
    }

    getDOM($) {
        return this.#formComponent ? this.#formComponent.getDOM($) : null;
    }

    createWindow() {
        return window.ipc.invoke('form:call', {
            formName: this.getName(),
            methodName: 'createWindow'
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

    registerChildren(...components) {
        for (let childrenComponent of components) {

            childrenComponent.events.setListenCondition(() => this.#isListeningComponentEvents);

            childrenComponent.events.on('updated', (component) => {
                this.events.emit('component-updated', component);
            });

            childrenComponent.events.on('children-added', (component, ...addedChildren) => {
                this.registerChildren(...addedChildren);
                this.events.emit('component-children-added', component, ...addedChildren);
            });

        }

        this.#components = this.#components.concat(components);
    }

    getComponentNames() {
        return this.#formComponent.getChildrenNames();
    }

    getComponentsList() {
        return this.#components;
    }

    createComponent(className, ...componentArgs) {
        let component = new Form.Components[className](...componentArgs);

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

}

module.exports = Form;
