const { Component } = load.class('component');
const Traits = load.models.traits();
const Props = load.models.properties();

class ListBox extends Component {

    $itemsDOM;
    itemClickCallback;

    static getIcon() {
        return 'view-list-outline';
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.AlignmentTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.MetaDataTrait(),
            new Traits.MetaDataTrait(),
            new Traits.ListBoxTrait(),
            new Traits.ActiveIndexTrait(),
        ]);
    }

    setDefaults() {
        this.width = 200;
        this.height = 300;
        this.activeIndex = -1;

        this.schema = {
            id: {
                title: t('ID'),
                type: 'string',
                visible: false
            },
            title: {
                title: t('Title'),
                type: 'string',
                visible: true
            }
        };

        this.items = [{
            id: 'first',
            title: 'First Item'
        }, {
            id: 'second',
            title: 'Second Item'
        }, {
            id: 'third',
            title: 'Third Item'
        }];
    }

    getEventNames() {
        return ['item-select'].concat(
            Component.EventNames.Mouse,
        )
    }

    getDefaultEventName() {
        return 'item-select';
    }

    static getEventHandlerArguments(eventName) {
        if (eventName == 'item-select') {
            return ['item', 'index'];
        }
        return [];
    }

    registerEventHandler(eventName, handlerCallback) {
        if (eventName == 'item-select') {
            this.itemClickCallback = handlerCallback;
            return;
        }
        super.registerEventHandler(eventName, handlerCallback);
    }

    getSelectedItem() {
        const index = this.getPropertyValue('activeIndex');
        if (index === null || index < 0) { return null; }
        return this.items[index];
    }

    addItem(item) {
        this.items.push(item);
        this.rebuildItemsDOM();
    }

    removeItem(id) {
        const selectedItem = this.getSelectedItem();
        if (selectedItem && selectedItem.id == id) {
            this.resetSelection();
        }
        this.items = this.items.filter((item) => item.id != id);
        this.rebuildItemsDOM();
    }

    removeSelectedItem() {
        const index = this.getPropertyValue('activeIndex');
        if (index === null || index < 0) { return null; }
        this.removeItem(this.getSelectedItem().id);
    }

    clear() {
        this.items = [];
        this.rebuildItemsDOM();
    }

    isRebuildOnPropertyUpdate(updatedPropertyName, value) {
        if (updatedPropertyName == 'activeIndex') {
            this.highlightActiveItem();
            return false;
        }

        if (updatedPropertyName == 'items') {
            this.setPropertyValue('activeIndex', -1);
            this.rebuildItemsDOM();
            return false;
        }

        return true;
    }

    getItemSchemaProperties() {
        return this.properties.items.schemaPropList;
    }

    buildItemsDOM() {
        const items = this.getPropertyValue('items');
        const schema = this.getPropertyValue('schema');

        const $wrap = $('<table/>', { class: 'items' });
        for (const [index, item] of Object.entries(items)) {
            const $item = this.buildItemDOM(schema, item, index);
            $item.appendTo($wrap);
        }

        this.highlightActiveItem();
        return $wrap;
    }

    buildItemDOM(schema, item, index) {
        const $item = $('<tr/>', { class: 'item' });

        for (let [propName, propMeta] of Object.entries(schema)) {
            if (!propMeta.visible) { continue; }
            const $cell = $('<td/>', { class: 'cell' });
            const value = item[propName] ?? '';
            $cell.html(value).appendTo($item);
        }

        $item.on('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.setPropertyValue('activeIndex', index);
            if (this.itemClickCallback) {
                this.itemClickCallback(event, item, index);
            }
        });

        return $item;
    }

    buildDOM() {
        this.$itemsDOM = this.buildItemsDOM();
        this.highlightActiveItem();

        const $dom = this.buildTagDOM('div', { class: ['component', 'listbox'] }, this.$itemsDOM);
        $dom.on('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.resetSelection();
        });

        return $dom;
    }

    resetSelection() {
        this.setPropertyValue('activeIndex', -1);
    }

    selectItem(index) {
        this.setPropertyValue('activeIndex', index);
        this.highlightActiveItem();
    }

    selectItemById(id) {
        if (!this.$itemsDOM) { return; }
        const items = this.getPropertyValue('items');
        for (const [index, item] of Object.entries(items)) {
            if (item.id == id) {
                this.selectItem(index);
                return;
            }
        }
    }

    highlightActiveItem() {
        if (!this.$itemsDOM) { return; }
        const index = this.getPropertyValue('activeIndex');
        this.$itemsDOM.find('.item.active').removeClass('active');
        if (index >= 0) {
            this.$itemsDOM.find('.item').eq(index).addClass('active');
        }
    }

    rebuildItemsDOM() {
        if (!this.$itemsDOM) { return; }
        const $currentDOM = this.$itemsDOM;
        this.$itemsDOM = this.buildItemsDOM();
        $currentDOM.replaceWith(this.$itemsDOM);
    }

}

module.exports = {
    groupName: t('Lists'),
    classes: {
        ListBox
    }
}
