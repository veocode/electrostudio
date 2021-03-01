class Window {

    #handle

    #defaultOptions = {
        title: config.appTitle,
        width: 400,
        height: 400,
        menu: null,
        resizable: true,
        maximizable: true,
        minimizable: true,
    }

    constructor(name, options) {
        this.name = name;
        this.options = Object.assign({}, this.#defaultOptions, options);
    }

    async #create() {
        const { BrowserWindow } = require('electron');

        const size = this.#calculateSize();

        const settings = {
            show: false,
            width: size.width,
            height: size.height,
            resizable: this.options.resizable,
            maximizable: this.options.maximizable,
            minimizable: this.options.minimizable,
            webPreferences: {
                webSecurity: true,
                contextIsolation: true,
                preload: `${rootDir}/windows/base/base-preload.js`
            }
        };

        if ('x' in this.options && 'y' in this.options) {
            settings.x = this.options.x;
            settings.y = this.options.y;
        } else {
            settings.center = true;
        }

        this.#handle = new BrowserWindow(settings);

        if (!this.options.menu) {
            this.#handle.setMenu(null);
        }

        await this.#handle.loadFile(`${rootDir}/windows/base/base-window.html`, {
            query: {
                name: this.name,
                options: JSON.stringify(this.options),
            }
        });

        this.#handle.show();

        if ('isDebug' in this.options && this.options.isDebug) {
            this.#handle.webContents.openDevTools();
        }
    }

    #calculateSize() {
        let width = this.options.width;
        let height = this.options.height;

        if (typeof (width) == 'string' && width.includes('%')) {
            let percent = parseInt(width);
            width = Math.round((percent * global.config.screenSize.width) / 100);
        }

        if (typeof (height) == 'string' && height.includes('%')) {
            let percent = parseInt(height);
            height = Math.round((percent * global.config.screenSize.height) / 100);
        }

        return { width, height };
    }

    show() {
        if (!this.#handle) {
            this.#create();
            return;
        }
        this.#handle.show();
    }

    getViewPath() {
        return `windows/${this.name}/${this.name}-window.html`;
    }

    static getViewHTML(windowName) {
        const fs = require('fs');
        const path = require('path');
        return fs.readFileSync(path.resolve(__dirname, `../windows/${windowName}/${windowName}-window.html`), { encoding: 'utf8' });
    }

}

module.exports = Window;
