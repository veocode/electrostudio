class Form {

    static Components = load.models.components();

    events = load.instance('classes/events');

    #formComponent;
    #components = [];
    #windowHandle;

    #componentsCountByClass = {};
    #isListeningComponentEvents = false;

    getName() {
        return this.getSchema().name;
    }

    getSchema() {
        // Override in children
    }

    build() {
        this.buildForm();
        this.buildComponents();
        this.#isListeningComponentEvents = true;
    }

    buildForm() {
        this.#formComponent = new Form.Components.Form(this.getSchema());
    }

    buildComponents() {
        // Override in children
    }

    getDOM($) {
        return this.#formComponent ? this.#formComponent.getDOM($) : null;
    }

    addChildren(...components) {
        this.#formComponent.addChildren(...components);

        let childrenComponents = this.#formComponent.getRecursiveChildrenList();
        let added = [];

        for (let childrenComponent of childrenComponents) {
            if (!this.#components.includes(childrenComponent)) {
                added.push(childrenComponent);
            }
        }

        this.registerChildren(...added);

        this.#components = childrenComponents;
    }

    registerChildren(...components) {
        for (let childrenComponent of components) {

            childrenComponent.events.on('updated', (component) => {
                if (!this.#isListeningComponentEvents) { return; }
                this.events.emit('component-updated', component);
            });

        }
    }

    getComponentNames() {
        return this.#formComponent.getChildrenNames();
    }

    getComponentsList() {
        return this.#components;
    }

    createComponent(className, ...componentArgs) {
        let component = new Form.Components[className](...componentArgs);

        if (!component.name) {
            component.name = this.getNextComponentName(className);
        }

        className in this.#componentsCountByClass ?
            this.#componentsCountByClass[className] += 1 :
            this.#componentsCountByClass[className] = 1;

        return component;
    }

    getComponentCountByClass(className) {
        return className in this.#componentsCountByClass ?
            this.#componentsCountByClass[className] :
            0;
    }

    getNextComponentName(className) {
        return `${className}${this.getComponentCountByClass(className) + 1}`;
    }

    async createWindow() {
        const { BrowserWindow } = require('electron');

        const defaultOptions = {
            title: config.appTitle,
            width: 400,
            height: 400,
            menu: null,
            resizable: true,
            maximizable: true,
            minimizable: true,
        }

        const options = Object.assign({}, defaultOptions, this.getSchema());
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

        this.#windowHandle = new BrowserWindow(settings);

        if (!options.menu) {
            this.#windowHandle.setMenu(null);
        }

        const baseViewPath = load.path(config.baseWindowView);
        const baseViewQuery = {
            name: this.getName(),
            options: JSON.stringify(options),
        };

        await this.#windowHandle.loadFile(baseViewPath, { query: baseViewQuery });

        if (config.isDebug) {
            this.#windowHandle.webContents.openDevTools();
        }

        this.#windowHandle.show();
    }

    #calculateWindowSize(width, height) {
        const isRelativeWidth = (typeof (width) == 'string' && width.includes('%'));
        const isRelativeHeight = (typeof (height) == 'string' && height.includes('%'));

        if (isRelativeWidth || isRelativeHeight) {
            const { screen } = require('electron');
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

module.exports = Form;
