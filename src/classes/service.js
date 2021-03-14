class Service {

    async callMethod(methodName, methodArgs) {
        return new Promise((resolve, reject) => {

            if (!(methodName in this)) {
                reject();
                return;
            };

            Promise.resolve(this[methodName](...methodArgs)).then((result) => resolve(result));

        });
    }

}

module.exports = Service;