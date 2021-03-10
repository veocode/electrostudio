class EventManager {

    #listeners = {};
    #listenCheckCallback = () => { return true; };

    on(eventName, callback) {
        const listeners = (eventName in this.#listeners) ? this.#listeners[eventName] : [];
        listeners.push(callback);
        this.#listeners[eventName] = listeners;
    }

    emit(eventName, ...params) {
        if (!this.#listenCheckCallback()) {
            return;
        }
        if (!this.hasListeners(eventName)) {
            return;
        }
        console.log('EMIT', eventName, ...params);
        for (let callback of this.#listeners[eventName]) {
            callback(...params);
        }
    }

    hasListeners(eventName) {
        return eventName in this.#listeners && this.#listeners[eventName].length > 0;
    }

    removeListeners(eventName) {
        this.#listeners[eventName] = [];
    }

    setListenCondition(listenCheckCallback) {
        this.#listenCheckCallback = listenCheckCallback;
    }

}

module.exports = EventManager;
