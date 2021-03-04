class Form {

    #rootComponent

    static Components = load.models.components();

    #componentsCountByClass = {};

    constructor() {
        this.build();
    }

    build() {

    }

    buildFromSchema(schema) {

    }

    setRootComponent(component) {
        this.#rootComponent = component;
    }

    getRootComponent() {
        return this.#rootComponent;
    }

    createRootComponent(className, ...createComponentArgs) {
        this.#rootComponent = this.createComponent(className, ...createComponentArgs)
        return this.#rootComponent;
    }

    createComponent(className, ...componentArgs) {
        let component = new Form.Components[className](...componentArgs);

        component.name = this.getNextComponentName(className);

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

    getNextComponentName(className) {
        return `${className}${this.getComponentCountByClass(className) + 1}`;
    }

    getRenderedHTML() {
        return this.#rootComponent ? this.#rootComponent.getRenderedHTML() : '';
    }

}

module.exports = Form;
