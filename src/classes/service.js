class Service {

    controller;

    constructor(controller) {
        this.controller = controller;
    }

    async callMethod(caller, methodName, methodArgs) {
        return new Promise((resolve, reject) => {

            if (!(methodName in this)) {
                reject();
                return;
            };

            Promise.resolve(this[methodName](caller, ...methodArgs)).then((result) => resolve(result));

        });
    }

}

module.exports = Service;