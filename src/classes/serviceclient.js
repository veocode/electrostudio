const ipc = load.electron('ipcRenderer');

class ServiceClient {

    serviceName;
    clientWindow;

    #callCount = 0;

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

        this.#callCount += 1;

        const resultPromise = new Promise(resolve => {

            const callId = this.#callCount;

            ipc.send('service:call', {
                callId,
                windowName: this.clientWindow.name,
                serviceName: this.serviceName,
                methodName,
                methodArgs
            });

            ipc.once(`service:result:${callId}`, (event, result) => {
                resolve(result);
            });

            if (this.#callCount >= Number.MAX_SAFE_INTEGER - 1) {
                this.#callCount = 0;
            }

        });

        return resultPromise;

    }

}

module.exports = ServiceClient;