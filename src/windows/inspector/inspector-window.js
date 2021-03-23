const Window = load.class('window');

class InspectorWindow extends Window {

    editor;

    start() {
        this.editor = this.form.getEditor();

        this.form.on('component:show', (componentSchema) => {
            this.editor.setSchema(componentSchema);
        });
    }

    onPanelClick(event, sender) {
        // this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;