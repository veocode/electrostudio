class Controller {

    ipc = load.electron('ipcMain');

    #forms = {};
    #windows = {};
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
        this.ipc.handle('service:call', async (event, call) => {
            const caller = {
                form: this.#forms[call.windowName],
                window: this.#windows[call.windowName],
            };
            return await this.callServiceMethod(caller, call.serviceName, call.methodName, call.methodArgs);
        });

        this.ipc.handle('form:call', async (event, call) => {
            return await this.callFormMethod(call.formName, call.methodName, call.methodArgs || []);
        });

        this.ipc.on('form:event', async (event, call) => {
            this.dispatchFormEvent(call.formName, call.eventName, call.payload || {});
        });

    }

    loadForm(formName) {
        this.#forms[formName] = load.form(formName);
    }

    getForm(formName) {
        if (!(formName in this.#forms)) {
            this.#forms[formName] = load.form(formName);
        }
        return this.#forms[formName];
    }

    getWindow(formName) {
        if (!(formName in this.#windows)) {
            this.createFormWindow(formName);
        }
        return this.#windows[formName];
    }

    getService(serviceName) {
        if (!(serviceName in this.#services)) {
            this.#services[serviceName] = load.service(serviceName, this);
        }
        return this.#services[serviceName];
    }

    async callServiceMethod(caller, serviceName, methodName, methodArgs) {
        const service = this.getService(serviceName);
        const result = await service.callMethod(caller, methodName, methodArgs);
        return result;
    }

    async callFormMethod(formName, methodName, methodArgs = []) {
        let result = null;

        switch (methodName) {
            case 'createWindow':
                await this.createFormWindow(formName);
                break;
        }

        return result;
    }

    dispatchFormEvent(formName, eventName, payload = {}) {
        for (let [name, window] of Object.entries(this.#windows)) {
            if (name == formName) { continue; }
            const channel = `form:${formName}:${eventName}`;
            console.log('dispatchFormEvent', eventName, 'to', name);
            window.webContents.send(channel, payload);
        }
    }

    async createFormWindow(formName) {
        if (formName in this.#windows) {
            this.#windows[formName].show();
            return;
        }

        const form = this.getForm(formName);
        const BrowserWindow = load.electron('BrowserWindow');

        const defaultOptions = {
            title: config.appTitle,
            width: 400,
            height: 400,
            menu: null,
            resizable: true,
            maximizable: true,
            minimizable: true,
        }

        const options = Object.assign({}, defaultOptions, form.getSchema());
        const size = this.#calculateWindowSize(options.width, options.height);

        const settings = {
            show: false,
            width: size.width,
            height: size.height,
            resizable: options.resizable,
            maximizable: options.maximizable,
            minimizable: options.minimizable,
            frame: false,
            webPreferences: {
                webSecurity: true,
                contextIsolation: false,
                nodeIntegration: true,
                preload: load.path(config.baseWindowPreloadScript)
            }
        };

        if ('left' in options && 'top' in options) {
            settings.x = options.left;
            settings.y = options.top;
        } else {
            settings.center = true;
        }

        const windowHandle = new BrowserWindow(settings);

        if (!options.menu) {
            windowHandle.setMenu(null);
        }

        const baseViewPath = load.path(config.baseWindowView);
        const baseViewQuery = {
            name: formName,
            options: JSON.stringify(options),
        };

        await windowHandle.loadFile(baseViewPath, { query: baseViewQuery });

        if (config.isDebug) {
            windowHandle.webContents.openDevTools();
        }

        if (formName != 'main' && this.#windows.main) {
            windowHandle.setParentWindow(this.#windows.main);
        }

        windowHandle.show();
        this.#windows[formName] = windowHandle;
    }

    #calculateWindowSize(width, height) {
        const isRelativeWidth = (typeof (width) == 'string' && width.includes('%'));
        const isRelativeHeight = (typeof (height) == 'string' && height.includes('%'));

        if (isRelativeWidth || isRelativeHeight) {
            const screen = load.electron('screen');
            const screenSize = screen.getPrimaryDisplay().workAreaSize;

            if (isRelativeWidth) {
                let percent = parseInt(width);
                width = Math.round((percent * screenSize.width) / 100);
            }

            if (isRelativeHeight) {
                let percent = parseInt(height);
                height = Math.round((percent * screenSize.height) / 100);
            }
        }

        return { width, height };
    }

}

module.exports = Controller;