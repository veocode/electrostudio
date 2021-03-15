class Controller {

    ipc = load.electron('ipcMain');

    #forms = {};
    #services = {};

    boot() {
        // Override in children
    }

    start() {
        // Override in children
    }

    run() {
        this.boot();
        this.registerIPCListeners();
        this.start();
    }

    registerIPCListeners() {
        this.ipc.on('service:call', async (event, payload) => {
            const result = await this.callServiceMethod(payload.serviceName, payload.methodName, payload.methodArgs);
            event.reply(`service:result:${payload.callId}`, result);
        });
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
