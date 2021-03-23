const Window = load.class('window');

class InspectorWindow extends Window {

    start() {
        this.form.on('component:show', (componentPropValues) => {
            this.Label1.label = componentPropValues.name;
        });
    }

    onPanelClick(event, sender) {
        // this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;