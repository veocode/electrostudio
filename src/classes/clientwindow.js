class ClientWindow {

    form;

    constructor(form) {
        this.form = form;
    }

    getFormRenderedHTML() {
        return this.form.getRenderedHTML();
    }

}

module.exports = ClientWindow;