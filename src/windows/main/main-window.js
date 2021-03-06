const ClientWindow = load.class('clientwindow');

class MainWindow extends ClientWindow {

    start() {
        console.log(this.btnNewProject.hint);
    }

}

module.exports = MainWindow;