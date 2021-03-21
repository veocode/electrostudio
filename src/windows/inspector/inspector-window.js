const Window = load.class('window');

class InspectorWindow extends Window {

    start() {

    }

    onPanelClick(event, sender) {
        this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;