class ComponentFactory {

    static Library = load.componentClasses();

    static Create(className, ...componentArgs) {
        return new ComponentFactory.Library[className](...componentArgs);
    }

}

module.exports = {
    ComponentFactory
}