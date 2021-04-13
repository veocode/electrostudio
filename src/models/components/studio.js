const { Component } = load.class('component');
const Property = load.class('property');
const Traits = load.models.traits();

class InspectorPropertyEditor extends Component {

    #schema = {};

    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.AlignmentTrait(),
        ]);
    }

    setDefaults() {
        this.alignment = 'client';
    }

    setSchema(schema) {
        this.#schema = schema;
        this.buildEditor();
    }

    clearSchema() {
        this.$dom.empty();
        this.#schema = {};
    }

    setParentSchema(parentSchema) {
        this.buildParentSelector(parentSchema);
    }

    buildDOM() {
        return this.buildTagDOM('div', { class: ['component', 'prop-editor'] });
    }

    buildEditor() {
        const props = this.getComponentProps(this.#schema.className);
        const values = this.#schema.properties;

        this.$dom.empty();

        for (let [name, prop] of Object.entries(props)) {
            const $row = $('<div/>', { class: `row row-${name}` }).appendTo(this.$dom);
            const $titleCell = $('<div/>', { class: 'cell title' }).appendTo($row);
            const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);
            const currentValue = values[prop.name];

            const $valueInput = prop.buildInput(currentValue, {
                result: newValue => {
                    this.onInputResult(prop, currentValue, newValue);
                    $valueInput.blur();
                },
                error: message => {
                    this.onInputError(prop, currentValue, message);
                }
            });

            $titleCell.html(prop.name);
            $valueCell.append($valueInput);
        }
    }

    buildParentSelector(parentSchema) {
        const $row = $('<div/>', { class: 'row row-parent' }).prependTo(this.$dom);
        const $titleCell = $('<div/>', { class: 'cell title' }).html(t('Parent')).appendTo($row);
        const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);

        const $parentLink = $('<a href="#"/>').html(parentSchema.properties.name).appendTo($valueCell);

        $parentLink.on('click', event => {
            event.preventDefault();
            this.events.emit('parent-selected', parentSchema.properties.name);
        });
    }

    getComponentProps(componentClassName) {
        const { ComponentFactory } = load.class('factories');
        const component = ComponentFactory.Create(componentClassName);
        return component.getProperties();
    }

    onInputResult(prop, previousValue, value) {
        this.events.emit('input-result', prop, previousValue, value);
    }

    onInputError(prop, previousValue, message) {
        this.events.emit('input-error', message);
        prop.setInputValue(previousValue);
    }

}

class InspectorEventEditor extends Component {

    #schema = {};
    #inputs = {};

    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.AlignmentTrait(),
        ]);
    }

    setDefaults() {
        this.alignment = 'client';
    }

    setSchema(schema) {
        this.#schema = schema;
        this.buildEditor();
    }

    clearSchema() {
        this.$dom.empty();
        this.#schema = {};
    }

    setEventHandlerName(eventName, handlerName) {
        if (!(eventName in this.#inputs)) { return; }
        this.#inputs[eventName].val(handlerName).blur();
    }

    buildDOM() {
        return this.buildTagDOM('div', { class: ['component', 'prop-editor'] });;
    }

    buildEditor() {
        const events = this.#schema.events;

        this.#inputs = {};
        this.$dom.empty();

        for (let [eventName, handlerName] of Object.entries(events)) {
            const $row = $('<div/>', { class: `row row-${eventName}` }).appendTo(this.$dom);
            const $titleCell = $('<div/>', { class: 'cell title' }).appendTo($row);
            const $valueCell = $('<div/>', { class: 'cell value' }).appendTo($row);

            const currentValue = handlerName ?? '';
            const $valueInput = $('<input/>', { type: 'text', class: 'prop-input', value: currentValue });
            $valueInput.on('keydown', event => {
                if (event.keyCode == 13) {
                    const newValue = $valueInput.val();
                    this.onInputResult(eventName, currentValue, newValue || null);
                    $valueInput.blur();
                }
            });

            $valueInput.on('dblclick', event => {
                if ($valueInput.val()) { return; }
                this.onInputAutoGenerateValue(eventName, currentValue);
            })

            $titleCell.html(eventName);
            $valueCell.append($valueInput);

            this.#inputs[eventName] = $valueInput;
        }
    }

    onInputResult(eventName, previousValue, value) {
        this.events.emit('input-result', eventName, previousValue, value);
    }

    onInputError(message, previousValue) {
        this.events.emit('input-error', message);
        prop.setInputValue(previousValue);
    }

    onInputAutoGenerateValue(eventName, previousValue) {
        this.events.emit('input-auto', this.#schema.properties.name, eventName, previousValue);
    }

}

class CodeEditor extends Component {

    #editor;
    #fileToOpen;
    #openedFilePath;
    #lastSavedVersionId;

    #isDirty = false;

    static isInternal() {
        return true;
    }

    getTraits() {
        return super.getTraits().concat([
            new Traits.NameTrait(),
            new Traits.PositionTrait(),
            new Traits.SizeTrait(),
            new Traits.AlignmentTrait(),
        ]);
    }

    setDefaults() {
        this.width = 300;
        this.height = 300;
    }

    buildDOM() {
        const $dom = this.buildTagDOM('div', { class: ['component', 'code-editor'] });
        this.initEditor($dom);
        return $dom;
    }

    isRebuildOnPropertyUpdate(updatedPropertyName, value) {
        return false;
    }

    initEditor($container) {
        const path = load.node('path');
        const amdLoader = load.node(path.resolve(load.path(), '../node_modules/monaco-editor/min/vs/loader.js'));
        const amdRequire = amdLoader.require;

        const uriFromPath = (_path) => {
            var pathName = path.resolve(_path).replace(/\\/g, '/');
            if (pathName.length > 0 && pathName.charAt(0) !== '/') {
                pathName = '/' + pathName;
            }
            return encodeURI('file://' + pathName);
        }

        amdRequire.config({
            baseUrl: uriFromPath(path.resolve(load.path(), '../node_modules/monaco-editor/min'))
        });

        amdRequire(['vs/editor/editor.main'], () => {
            this.#editor = monaco.editor.create($container.get(0), {
                value: 'return;',
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
                minimap: {
                    enabled: false
                },
            });

            this.#editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
                this.saveFile();
            });

            this.#editor.getModel().onDidChangeContent(() => {
                this.setDirty(this.#lastSavedVersionId != this.#editor.getModel().getAlternativeVersionId());
            });

            if (this.#fileToOpen) {
                this.openFile(this.#fileToOpen);
                this.#fileToOpen = null;
            }
        });
    }

    async openFile(filePath) {
        if (!this.#editor) {
            this.#fileToOpen = filePath;
            return;
        }

        const content = await load.read(filePath);
        await this.#editor.getModel().setValue(content);
        this.#openedFilePath = filePath;
        this.events.emit('file:loaded', filePath);
    }

    async saveFile() {
        const filePath = this.#openedFilePath;
        const content = this.#editor.getModel().getValue();
        this.events.emit('file:save', filePath, content);
        this.resetDirty();
    }

    getValue() {
        if (!this.#editor) { return ''; }
        return this.#editor.getModel().getValue();
    }

    setValue(value) {
        if (!this.#editor) { return; }
        this.#editor.getModel().setValue(value);
    }

    resetDirty() {
        this.#isDirty = false;
        this.#lastSavedVersionId = this.#editor.getModel().getAlternativeVersionId();
    }

    setDirty(isDirty) {
        if (this.#isDirty != isDirty) {
            this.events.emit('file:dirty-changed', isDirty);
        }
        this.#isDirty = isDirty;
    }

}

module.exports = {
    groupName: null,
    classes: {
        InspectorPropertyEditor,
        InspectorEventEditor,
        CodeEditor
    }
}
