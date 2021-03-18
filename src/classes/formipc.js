class FormIPC {

    #form;

    constructor(form) {
        this.#form = form;
    }

    getChannelName(eventName = null) {
        let channel = `form:${this.#form.getName()}`;
        if (eventName) {
            channel += `:${eventName}`;
        }
        return channel;
    }

    on(eventName, callback) {
        window.ipc.on(this.getChannelName(eventName), (event, payload) => {
            callback(payload);
        });
    }

    emit(eventName, payload) {
        window.ipc.send('form:event', {
            formName: this.#form.getName(),
            eventName,
            payload
        });
    }

}

module.exports = FormIPC;
