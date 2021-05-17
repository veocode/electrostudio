const Input = load.class('input');

module.exports = {

    StringInput: class extends Input { },

    ListInput: class extends Input {

        $list;

        items = [];

        constructor(startingValue, items = []) {
            super(startingValue);
            this.items = items;
        }

        displayValue(value) {
            if (typeof (value) != 'string') {
                value = value.toString();
            }
            this.$list.val(value);
        }

        buildDOM() {
            this.$list = $('<select/>', { class: 'prop-input prop-list' });

            for (let item of this.items) {
                $('<option/>', { value: item }).html(item).appendTo(this.$list);
            }

            this.displayValue(this.getValue());

            this.$list.on('change', () => {
                this.setValue(this.$list.val());
            });

            return this.$list;
        }

    },

    ColorInput: class extends Input {

        $textInput;
        $colorInput;

        displayValue(value) {
            this.$textInput.val(value);
            this.$colorInput.val(value);
        }

        blur() {
            this.$textInput.blur();
            this.$colorInput.blur();
        }

        buildDOM() {
            const $inputGroup = $('<div/>', { class: 'prop-input-group' });

            this.$textInput = $('<input/>', { class: 'prop-input', type: 'text' }).appendTo($inputGroup);
            this.$colorInput = $('<input/>', { class: 'prop-input-color', type: 'color' }).appendTo($inputGroup);

            this.$textInput.val(this.getValue());
            this.$colorInput.val(this.getValue());

            this.$textInput.on('change', () => {
                this.setValue(this.$textInput.val());
            });

            this.$colorInput.on('change', () => {
                this.setValue(this.$colorInput.val());
            });

            return $inputGroup;
        }

    }

}
