const { Component, ContainerComponent } = load.class('component');
const Traits = load.models.traits();

class TabPane extends ContainerComponent {

    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.LabelTrait(),
            new Traits.BackgroundColorTrait(),
            new Traits.Layouts.OrderIndexTrait(),
        ]);
    }

    setDefaults() {
        this.label = 'Tab';
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
        return ['orderIndex', 'label'].includes(updatedPropertyName);
    }

    onAfterRebuild() {
        if (this.parent) {
            this.parent.selectTab();
        }
    }

    buildDOM(...$childrenDOM) {
        const $wrapper = this.buildInnerTagDOM('div', { class: ['tab-pane-body', 'container'] }, ...$childrenDOM)
        return this.buildTagDOM('div', { class: ['tab-pane'] }, $wrapper);
    }

    getDesignerActions() {
        return {
            addTab: {
                title: t('Add Tab'),
                icon: 'tab-plus'
            }
        };
    }

    addTab(window) {
        if (this.parent) {
            this.parent.addTab(window);
        }
    }
}

class Tabs extends ContainerComponent {

    static getIcon() {
        return 'tab';
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.ActiveIndexTrait()
        ]);
    }

    setDefaults() {
        this.width = 300;
        this.height = 200;
        this.activeIndex = 0;
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

    onAfterBuild() {
        this.selectTab();
    }

    onAfterRebuild() {
        this.selectTab();
    }

    selectTab(index = null) {
        if (index == null) {
            index = this.activeIndex
        } else {
            this.assignPropertyValue('activeIndex', index);
        }
        const $dom = this.getDOM();
        const $panes = $dom.find('.tab-pane');
        const $buttons = $dom.find('.tab-button');
        $panes.removeClass('active').eq(index).addClass('active');
        $buttons.removeClass('active').eq(index).addClass('active');
    }

    buildHeader() {
        const $header = this.buildInnerTagDOM('div', { class: ['tabs-header'] });
        const tabPanes = this.getChildren();

        tabPanes.forEach((tabPane, tabIndex) => {
            const $tabButton = $('<button/>', { class: 'tab-button' }).text(tabPane.label);

            $tabButton.on('click', (event) => {
                event.preventDefault();
                this.selectTab(tabIndex);
            });

            $tabButton.appendTo($header);
        });

        return $header;
    }

    buildDOM(...$childrenDOM) {
        const $header = this.buildHeader();
        const $wrapper = this.buildInnerTagDOM('div', { class: ['tabs-panes', 'container'] }, ...$childrenDOM)
        const $dom = this.buildTagDOM('div', { class: ['component', 'tabs'] }, $header, $wrapper);
        return $dom;
    }

    getDesignerActions() {
        return {
            addTab: {
                title: t('Add Tab'),
                icon: 'tab-plus'
            }
        };
    }

    onCreatedByDesigner(window) {
        this.addTab(window);
    }

    addTab(window) {
        const tab = window.form.createComponent('TabPane');
        this.addChildren(tab);
        window.registerComponents(tab);
        window.rebuildComponent(this);
        this.selectTab();
    }

}

module.exports = {
    groupName: t('Tabs'),
    classes: {
        TabPane,
        Tabs
    }
}
