const ClientWindow = load.class('clientwindow');

class MainWindow extends ClientWindow {

    start() {
        console.log(this.btnNewProject.hint);
    }

    onBtnNewProjectClick(event, sender) {
        this.btnSaveProject.icon = 'plus';
    }

}

module.exports = MainWindow;