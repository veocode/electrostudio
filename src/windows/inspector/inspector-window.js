const Window = load.class('window');
const Studio = load.singleton('studio/studio');

class InspectorWindow extends Window {

    start() {

    }

    onPanelClick(event, sender) {
        this.form.ipc.emit('panel-click', { message: 'hello from inspector' });
    }

}

module.exports = InspectorWindow;