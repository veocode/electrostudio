class ClientWindow {

    name;
    options;
    form;
    $;
    dom = {}

    constructor(name, options) {
        this.form = load.form(name);
        this.options = options;
    }

    boot() {
        this.registerDOM();
        this.form.buildComponents();

        this.setTitle(this.options.title);
        this.setContentDOM(this.form.getDOM($));

        this.registerComponents();

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

    registerComponents() {
        const components = this.form.getComponentsList();
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

            if (handlerName == null) { continue; }

            $componentDOM.on(eventName, (event) => {
                this.callMethod(handlerName, event, component);
            });

        }
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
        return this[methodName]();
    }

}

module.exports = ClientWindow;