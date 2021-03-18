const ipc = load.electron('ipcRenderer');

class Window {

    name;
    options;
    form;
    dom = {};
    serviceClients = {};

    constructor(name, options) {
        this.name = name;
        this.form = load.form(name);
        this.options = options;
    }

    boot() {
        this.registerDOM();
        this.form.build();

        this.setTitle(this.options.title);
        this.setContentDOM(this.form.getDOM($));

        this.registerComponents();
        this.registerFormEvents();

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
            $title: $('.window-title > .title'),
            $btnMinimize: $('.window-title button.minimize'),
            $btnMaximize: $('.window-title button.maximize'),
            $btnClose: $('.window-title button.close'),
        }

        this.dom.$btnMinimize && this.dom.$btnMinimize.on('click', (event) => {
            event.preventDefault();
            window.minimize();
        });

        this.dom.$btnMaximize && this.dom.$btnMaximize.on('click', (event) => {
            event.preventDefault();
            window.maximize();
        });

        this.dom.$btnClose && this.dom.$btnClose.on('click', (event) => {
            event.preventDefault();
            window.close();
        });
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

    registerComponentEvents(component) {
        const eventHandlerNames = component.getEventHandlerNames();
        if (!eventHandlerNames) { return; }

        const $componentDOM = component.getDOM($);
        for (const [eventName, handlerName] of Object.entries(eventHandlerNames)) {
            if (!handlerName) { continue; }

            $componentDOM.on(eventName, (event) => {
                this.callMethod(handlerName, event, component);
            });
        }
    }

    registerFormEvents() {

        this.form.events.on('component-updated', (component) => {
            this.rebuildComponent(component);
        });

        this.form.events.on('component-children-added', (component, ...addedChildren) => {
            this.registerComponents(...addedChildren);
            this.rebuildComponent(component);
        });

    }

    setTitle(title) {
        this.dom.$title.html(title);
        this.dom.$headTitle.html(title);
    }

    setContentDOM($rootContentElement) {
        this.dom.$body.empty().append($rootContentElement);
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
        const $currentDOM = component.getDOM($);
        component.rebuildDOM($);
        $currentDOM.replaceWith(component.getDOM($));
        this.registerComponentEvents(component);
    }

    getService(serviceName) {
        if (!(serviceName in this.serviceClients)) {
            this.serviceClients[serviceName] = load.instance('classes/serviceclient', serviceName, this);
        }
        return this.serviceClients[serviceName];
    }

    onError(error) {
        if (!(error.constructor.name in errors)) {
            console.error(error);
            alert([
                t('An error occured during execution'),
                t('Check console for details')
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