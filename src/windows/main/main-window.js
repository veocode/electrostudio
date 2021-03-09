const ClientWindow = load.class('clientwindow');

class MainWindow extends ClientWindow {

    start() {
        // TODO: add initialization logic
    }

    onBtnSaveProjectClick(event, sender) {
        console.log('SAVE PROJECT!');
    }

    onBtnNewProjectClick(event, sender) {
        this.btnSaveProject.icon = 'plus';
    }

}

module.exports = MainWindow;