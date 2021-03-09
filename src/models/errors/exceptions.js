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

    MethodNotExistsException: class extends BaseException {
        constructor(windowName, methodName) {
            super();
            this.windowName = windowName;
            this.methodName = methodName;
        }
    },

    SchemaInvalidComponentClass: class extends BaseException {
        constructor(requiredClass, passedClass) {
            super();
            this.requiredClass = requiredClass;
            this.passedClass = passedClass;
        }
    }

}
