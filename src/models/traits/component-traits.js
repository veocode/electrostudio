const Props = load.model('traits/properties');

class ComponentTrait {
    getProps() {
        return [];
    }
}

module.exports = {

    PositionTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty("left"),
                new Props.IntegerProperty("top"),
            ]
        };
    },

    SizeTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.IntegerProperty("width"),
                new Props.IntegerProperty("height"),
            ]
        };
    },

    NameTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty("name"),
            ]
        };
    },

    LabelTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.StringProperty("label", 'Default', false),
            ]
        };
    },

    AlignmentTrait: class extends ComponentTrait {
        getProps() {
            return [
                new Props.ListProperty("alignment", ['none', 'client', 'top', 'bottom', 'left', 'right'], 'none'),
            ]
        };
    }

}
