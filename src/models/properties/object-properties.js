const Property = load.class('property');

module.exports = {

    ObjectProperty: class extends Property {
        defaultValue = {};

        sanitize(value) {
            return value || {};
        }

        validate(value) {
            return typeof (value) === 'object';
        }
    },

    ObjectListProperty: class extends Property {
        defaultValue = [];

        sanitize(value) {
            return value || [];
        }

        validate(value) {
            return typeof (value) === 'object' && Array.isArray(value);
        }
    },

}
