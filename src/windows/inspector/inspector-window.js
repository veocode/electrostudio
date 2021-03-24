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
            }
        });
    }

    bindEvents() {
        this.form.on('component:show', (componentSchema) => {
            this.editor.setSchema(componentSchema);
        });
    }

    onPanelClick(event, sender) {
        // this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;