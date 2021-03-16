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
        return window.ipc.invoke('service:call', {
            windowName: this.clientWindow.name,
            serviceName: this.serviceName,
            methodName,
            methodArgs
        });
    }

}

module.exports = ServiceClient;