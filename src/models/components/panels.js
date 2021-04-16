const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class Panel extends ContainerComponent {

    static getIcon() {
        return 'card-outline';
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.BackgroundColorTrait(),
            new Traits.BorderTrait()
        ]);
    }

    setDefaults() {
        this.width = this.height = 200;
    }

    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }

    buildDOM(...$childrenDOM) {
        const $wrapper = this.buildInnerTagDOM('div', { class: ['panel-body', 'container'] }, ...$childrenDOM)
        return this.buildTagDOM('div', { class: ['component', 'panel'] }, $wrapper);
    }

}

class ToolPanel extends Panel {

    selectedButton = null;

    getTraits() {
        return super.getTraits().concat([
            new Traits.ToggleableTrait(),
        ]);
    }

    setDefaults() {
        this.width = 300;
        this.height = 60;
    }

    bindToggleOnClick() {
        for (let childrenComponent of this.getChildren()) {
            const $dom = childrenComponent.getDOM();
            $dom.on('click', event => {
                event.preventDefault();
                if ($dom.hasClass('active')) {
                    this.deactivateButton();
                } else {
                    this.deactivateButton();
                    this.activateButton(childrenComponent);
                }
            });
        }
    }

    activateButton(buttonComponent) {
        buttonComponent.getDOM().addClass('active');
        this.selectedButton = buttonComponent;
    }

    deactivateButton() {
        if (this.selectedButton == null) { return; }
        this.selectedButton.getDOM().removeClass('active');
        this.selectedButton = null;
    }

    buildDOM(...$childrenDOM) {
        if (this.toggleable) {
            this.bindToggleOnClick();
        }
        return this.buildTagDOM('div', { class: ['component', 'panel', 'toolpanel', 'container'] }, ...$childrenDOM);
    }

}

module.exports = {
    groupName: t('Panels'),
    classes: {
        Panel,
        ToolPanel
    }
}
