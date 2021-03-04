class Form {

    static Components = load.models.components();

    #formComponent;

    #componentsCountByClass = {};

    constructor() {
        this.#formComponent = this.buildForm();
        this.buildComponents();
    }

    buildForm() {
        return new Form.Components.Form();
    }

    buildComponents() {
        // Override in children
    }

    createWindow() {

    }

    addChildren(...components) {
        this.#formComponent.addChildren(...components);
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
        return this.#formComponent ? this.#formComponent.getRenderedHTML() : '';
    }

}

module.exports = Form;
