class ServiceClient {

    serviceName;
    clientWindow;

    constructor(serviceName, clientWindow) {
        this.serviceName = serviceName;
        this.clientWindow = clientWindow;

        return new Proxy(this, {
            get(target, methodName) {
                return (...methodArgs) => {
                    return target.callMethod(methodName, methodArgs);
                }
            },
        });
    }

    callMethod(methodName, methodArgs) {
        return new Promise(async (resolve, reject) => {
            const result = await window.ipc.invoke('service:call', {
                windowName: this.clientWindow.name,
                serviceName: this.serviceName,
                methodName,
                methodArgs
            });
            if (result.error) {
                reject(new Error(result.error));
                return;
            }
            resolve(result.data);
        });
    }

}

module.exports = ServiceClient;