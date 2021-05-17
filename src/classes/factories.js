class ComponentFactory {

    static Library = load.componentClasses();

    static Create(className, ...componentArgs) {
        return new ComponentFactory.Library[className](...componentArgs);
    }

}

class InputFactory {

    static Library = load.models.inputs();

    static Create(className, ...inputArgs) {
        return new InputFactory.Library[className](...inputArgs);
    }

}

module.exports = {
    ComponentFactory,
    InputFactory
}
