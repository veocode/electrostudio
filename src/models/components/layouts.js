const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class LayoutPane extends ContainerComponent {
    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.BackgroundColorTrait(),
            new Traits.Layouts.OrderIndexTrait(),
            new Traits.Layouts.WeightTrait(),
            new Traits.Layouts.FixedSizeTrait()
        ]);
    }
    setDefaults() {
        this.fixedSize = 0;
        this.weight = 1;
        this.backgroundColor = '#252525';
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }
    isResizable() {
        return false;
    }
    isDraggable() {
        return false;
    }
    isRebuildParentOnPropertyUpdate(updatedPropertyName, value) {
        return updatedPropertyName == 'orderIndex';
    }
    buildDOM(...$childrenDOM) {
        const $wrapper = this.buildInnerTagDOM('div', { class: ['pane-body', 'container'] }, ...$childrenDOM)
        const paneAttributes = {
            class: ['component', 'layout-pane'],
            style: [this.fixedSize ? '' : `flex-grow: ${this.weight};`]
        }
        return this.buildTagDOM('div', paneAttributes, $wrapper);
    }
    getInspectorActions() {
        return {
            addPane: {
                title: t('Add Pane'),
                icon: 'plus'
            }
        };
    }
    addPane(window) {
        if (this.parent) {
            this.parent.addPane(window);
        }
    }
}

class Layout extends ContainerComponent {
    static getIcon() {
        return 'columns';
    }
    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.Layouts.OrientationTrait(),
        ]);
    }
    setDefaults() {
        this.width = 200;
        this.height = 200;
    }
    getEventNames() {
        return [].concat(
            Component.EventNames.Mouse,
        )
    }
    getChildren() {
        return this.children.sort((a, b) => {
            return a.orderIndex - b.orderIndex;
        });
    }
    addChildren(...paneComponents) {
        let maxOrderIndex = this.children.length;
        if (maxOrderIndex) {
            for (let pane of this.children) {
                if (pane.orderIndex > maxOrderIndex) {
                    maxOrderIndex = pane.orderIndex;
                }
            }
        }
        maxOrderIndex += 1;
        for (let pane of paneComponents) {
            if (!pane.orderIndex) {
                pane.orderIndex = maxOrderIndex;
                maxOrderIndex += 1;
            }
        }
        super.addChildren(...paneComponents);
    }
    isRebuildChildrenOnPropertyUpdate(updatedPropertyName, value) {
        return updatedPropertyName == 'orientation';
    }
    buildDOM(...$childrenDOM) {
        const $wrapper = this.buildInnerTagDOM('div', { class: ['panes', 'container'] }, ...$childrenDOM)
        return this.buildTagDOM('div', { class: ['component', 'layout'] }, $wrapper);
    }

    getInspectorActions() {
        return {
            addPane: {
                title: t('Add Pane'),
                icon: 'plus'
            }
        };
    }

    addPane(window) {
        const pane = window.form.createComponent('LayoutPane');
        this.addChildren(pane);
        window.registerComponents(pane);
        window.rebuildComponent(this);
    }

}

module.exports = {
    groupName: t('Layouts'),
    classes: {
        LayoutPane,
        Layout
    }
}
