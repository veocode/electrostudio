class Controller {

    #forms = {};
    #services = {};

    boot() {
        // Override in children
    }

    start() {
        // Override in children
    }

    async run() {
        this.boot();
        this.registerIPCListeners();
        this.start();
    }

    registerIPCListeners() {

    }

    loadForm(formName) {
        this.#forms[formName] = load.form(formName);
    }

    getForm(formName) {
        if (!(formName in this.#forms)) {
            throw new errors.FormNotExistsException(formName);
        }
        return this.#forms[formName];
    }

    getService(serviceName) {
        if (!(serviceName in this.#services)) {
            this.#services[serviceName] = load.service(serviceName);
        }
        return this.#services[serviceName];
    }

    async callServiceMethod(serviceName, methodName, methodArgs) {
        const service = this.getService(serviceName);
        const result = await service.callMethod(methodName, methodArgs);
        return result;
    }

}

module.exports = Controller;
