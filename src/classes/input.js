class Input {

    events = load.instance('classes/eventmanager');
    $dom;

    #value;
    #previousValue;

    constructor(startingValue) {
        this.#value = startingValue;
        this.#previousValue = this.#value;
    }

    getValue() {
        return this.#value;
    }

    setValue(value) {
        this.#previousValue = this.#value;
        this.#value = value;
        this.displayValue(value);
        this.events.emit('result', this.#previousValue, value);
    }

    displayValue(value) {
        // override in children
        this.$dom.val(value);
    }

    resetValue() {
        this.setValue(this.#previousValue);
    }

    getDOM() {
        if (!this.$dom) {
            this.$dom = this.buildDOM();
        }
        return this.$dom;
    }

    buildDOM() {
        const $input = $('<input/>', { type: 'text', class: 'prop-input' });

        $input.on('keydown', event => {
            if (event.key == 'Enter') {
                this.setValue($input.val());
            }
        });

        $input.val(this.getValue());
        return $input;
    }

    blur() {
        if (this.$dom) {
            this.$dom.blur();
        }
    }

    on(eventName, ...args) {
        return this.events.on(eventName, ...args);
    }

}

module.exports = Input;
