const BaseException = load.class('exception');

module.exports = {

    PropertyValidationException: class extends BaseException {
        constructor(propertyName, value) {
            super();
            this.propertyName = propertyName;
            this.value = value;
        }
        getMessage() {
            return t('Invalid Property Value');
        }
    },

    PropertyInvalidException: class extends BaseException {
        constructor(propertyName) {
            super();
            this.propertyName = propertyName;
        }
        getMessage() {
            return t('Property does not exists');
        }
    },

    MethodNotExistsException: class extends BaseException {
        constructor(windowName, methodName) {
            super();
            this.windowName = windowName;
            this.methodName = methodName;
        }
        getMessage() {
            return t('Method does not exists');
        }
    },

    ComponentNameAlreadyExists: class extends BaseException {
        constructor(componentName, className) {
            super();
            this.componentName = componentName;
            this.className = className;
        }
        getMessage() {
            return t('Component Name already exists');
        }
    },

}
