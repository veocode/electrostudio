const Window = load.class('window');

class InspectorWindow extends Window {

    editor;

    start() {
        this.initEditor();
        this.bindEvents();
    }

    initEditor() {
        this.editor = this.form.getEditor();

        this.editor.setCallbacks({
            result: (prop, previousValue, value) => {
                this.form.emit('component:prop-updated', {
                    propertyName: prop.name,
                    previousValue,
                    value
                });
            },
            parentSelected: (name) => {
                this.form.emit('component:parent-selected', name);
            }
        });
    }

    bindEvents() {
        this.form.on('component:show', (payload) => {
            const { componentSchema, parentComponentSchema } = payload;
            this.editor.setSchema(componentSchema)
            if (parentComponentSchema !== null) {
                this.editor.setParentSchema(parentComponentSchema);
            }
        });

        this.form.on('component:hide', (payload) => {
            this.editor.clearSchema();
        });
    }

    onPanelClick(event, sender) {
        // this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;