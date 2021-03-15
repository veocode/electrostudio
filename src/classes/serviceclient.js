const ipc = load.electron('ipcRenderer');

class ServiceClient {

    serviceName;
    clientWindow;

    #callCount = 0;
    #resultPromises = {}

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

        console.log('CALL SERVICE', this.serviceName, 'METHOD', methodName, 'ARGS', methodArgs);

        this.#callCount += 1;

        ipc.send('service:call', {
            callId: this.#callCount,
            windowName: this.clientWindow.name,
            serviceName: this.serviceName,
            methodName,
            methodArgs
        });

        const resultPromise = new Promise(resolve => {

        });

    }

}

module.exports = ServiceClient;