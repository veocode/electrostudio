class Service {

    controller;

    constructor(controller) {
        this.controller = controller;
    }

    async callMethod(caller, methodName, methodArgs) {
        return new Promise((resolve, reject) => {
            const targetObject = this.getServiceObject();

            if (!(methodName in targetObject)) {
                throw new errors.ServiceMethodNotExistsException(this.constructor.name, methodName);
            };

            let resultPromiseOrValue;

            if (targetObject == this) {
                resultPromiseOrValue = targetObject[methodName](caller, ...methodArgs);
            } else {
                resultPromiseOrValue = targetObject[methodName](...methodArgs);
            }

            Promise.resolve(resultPromiseOrValue).then(
                result => resolve(result),
                error => reject(error)
            );
        });
    }

    getServiceObject() {
        return this;
    }

}

module.exports = Service;