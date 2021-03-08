class ClientWindow {

    form;

    constructor(form) {
        this.form = form;
        this.registerComponents();
        this.start();
    }

    start() {
        // Override in children
    }

    registerComponents() {
        const components = this.form.getComponentsList();
        if (components.length == 0) { return; }
        for (let component of components) {
            this[component.name] = component;
        }
    }

}

module.exports = ClientWindow;