class EventManager {

    #listeners = {};

    #enabled = true;

    on(eventName, callback) {
        if (!this.#enabled) { return; }
        const listeners = (eventName in this.#listeners) ? this.#listeners[eventName] : [];
        listeners.push(callback);
        this.#listeners[eventName] = listeners;
    }

    emit(eventName, ...params) {
        if (!this.#enabled) { return; }
        if (!this.hasListeners(eventName)) {
            return;
        }
        for (let callback of this.#listeners[eventName]) {
            callback(...params);
        }
    }

    hasListeners(eventName) {
        return eventName in this.#listeners && this.#listeners.length > 0;
    }

    removeListeners(eventName) {
        this.#listeners[eventName] = [];
    }

    enable() {
        this.#enabled = true;
    }

    disable() {
        this.#enabled = false;
    }

}

module.exports = EventManager;
