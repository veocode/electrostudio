class Service {

    controller;

    constructor(controller) {
        this.controller = controller;
    }

    async callMethod(caller, methodName, methodArgs) {
        return new Promise((resolve, reject) => {
            const targetObject = this.getServiceObject();

            if (!(methodName in targetObject)) {
                reject(new errors.ServiceMethodNotExistsException(this.constructor.name, methodName));
                return;
            };

            if (targetObject == this) {
                Promise.resolve(targetObject[methodName](caller, ...methodArgs)).then((result) => resolve(result));
            } else {
                Promise.resolve(targetObject[methodName](...methodArgs)).then((result) => resolve(result));
            }
        });
    }

    getServiceObject() {
        return this;
    }

}

module.exports = Service;