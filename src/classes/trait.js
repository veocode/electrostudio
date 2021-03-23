class ComponentTrait {

    getProps() {
        return [];
    }

    isAllowComponentDragging(values) {
        return true;
    }

    isAllowComponentResizing(values) {
        return true;
    }

    appendAttributes(attributes, values = {}) {
        // Override in children
    }

}

module.exports = ComponentTrait;