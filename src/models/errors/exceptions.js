const BaseException = load.class('exception');

module.exports = {

    PropertyValidationException: class extends BaseException {
        constructor(propertyName, value) {
            super();
            this.propertyName = propertyName;
            this.value = value;
        }
    },

    PropertyInvalidException: class extends BaseException {
        constructor(propertyName) {
            super();
            this.propertyName = propertyName;
        }
    },

    WindowFormRequiredException: class extends BaseException {
        constructor(windowName) {
            super();
            this.windowName = windowName;
        }
    },

}
