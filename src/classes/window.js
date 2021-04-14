const ipc = load.electron('ipcRenderer');
const fs = load.node('fs');
const mousetrap = load.node('mousetrap');

class Window {

    name;
    options;
    payload;
    form;
    dom = {};
    serviceClients = {};

    titleData = {
        title: '',
        document: '',
        isDirty: false
    }

    constructor(name, options, payload = {}) {
        this.name = name;
        this.form = load.form(name);
        this.options = options;
        this.payload = payload;
    }

    boot() {
        this.registerDOM();
        this.form.build();

        this.setTitle(this.options.title);
        this.displayForm();

        this.registerComponents();
        this.registerFormEvents();

        const windowStylesPath = load.path('windows', this.name, `${this.name}-window.css`);
        if (fs.existsSync(windowStylesPath)) {
            this.addCSS(windowStylesPath);
        }

        this.start();
    }

    start() {
        // Override in children
    }

    registerDOM() {
        this.dom = {
            $head: $('head'),
            $headTitle: $('head > title'),
            $body: $('.window-view'),
        }
    }

    registerComponents(...components) {
        if (!components.length) {
            components = this.form.getComponentsList();
        }
        if (components.length == 0) { return; }
        for (let component of components) {
            this[component.name] = component;
            this.registerComponentEvents(component);
        }
    }

    unregisterComponents(...components) {
        if (components.length == 0) { return; }
        for (let component of components) {
            delete this[component.name];
            const $dom = component.getDOM();
            if ($dom) {
                $dom.remove();
            }
        }
    }

    registerComponentEvents(component) {
        const eventHandlerNames = component.getEventHandlerNames();
        if (!eventHandlerNames) { return; }

        const $componentDOM = component.getDOM();
        for (const [eventName, handlerName] of Object.entries(eventHandlerNames)) {
            if (!handlerName) { continue; }

            component.registerEventHandler(eventName, (event) => {
                this.callMethod(handlerName, event, component);
            });
        }
    }

    registerFormEvents() {
        this.form.events.on('component:updated', (component) => {
            this.rebuildComponent(component);
        });

        this.form.events.on('component:children-added', (component, ...addedChildren) => {
            this.registerComponents(...addedChildren);
            this.rebuildComponent(component);
        });

        this.form.events.on('component:children-removed', (component, ...removedChildren) => {
            this.unregisterComponents(...removedChildren);
        });
    }

    updateTitle() {
        let title = this.titleData.title;
        if (this.titleData.document) {
            title += ` - ${this.titleData.document}`;
        }
        if (this.titleData.isDirty) {
            title += '*';
        }
        this.dom.$headTitle.html(title);
    }

    setTitle(title) {
        this.titleData.title = title;
        this.updateTitle();
    }

    setTitleDocument(titleDocument) {
        this.titleData.document = titleDocument;
        this.updateTitle();
    }

    setTitleDirty(titleIsDirty) {
        this.titleData.isDirty = titleIsDirty;
        this.updateTitle();
    }

    setContentDOM($rootContentElement) {
        this.dom.$body.empty().append($rootContentElement);
    }

    addCSS(url) {
        this.dom.$head.append(`<link rel="stylesheet" href="${url}">`);
    }

    addJS(url) {
        this.dom.$body.append(`<script src="${url}"></script>`);
    }

    displayForm() {
        this.setContentDOM(this.form.getDOM());
    }

    close() {
        this.form.closeWindow();
    }

    hide() {
        this.form.hideWindow();
    }

    show() {
        this.form.showWindow();
    }

    callMethod(methodName, ...methodArgs) {
        if (!(methodName in this)) {
            throw new errors.MethodNotExistsException(this.options.name, methodName);
        }
        return this[methodName](...methodArgs);
    }

    rebuildComponent(component) {
        if (component.isVirtual) {
            return;
        }
        const $currentDOM = component.getDOM();
        component.rebuildDOM();
        $currentDOM.replaceWith(component.getDOM());
        component.onAfterRebuild();
        this.registerComponentEvents(component);
    }

    getService(serviceName) {
        if (!(serviceName in this.serviceClients)) {
            this.serviceClients[serviceName] = load.instance('classes/serviceclient', serviceName, this);
        }
        return this.serviceClients[serviceName];
    }

    onShortcut(shortcut, callback) {
        mousetrap.bind(shortcut, callback);
    }

    onError(error) {
        if (!(error.constructor.name in errors)) {
            console.error(error);
            alert([
                t('An error occured during execution') + ':',
                `[${error.name}] ${error.message}`,
            ].join('\n'));
            return;
        }

        const message = [
            t('An error occured during execution') + ':',
            error.getMessage(),
            '',
            t('Error details:')
        ];

        for (let [prop, value] of Object.entries(error)) {
            message.push(`  [${prop}] = ${value}`);
        }

        alert(message.join('\n'));
    }

    onClose() {

    }

}

module.exports = Window;