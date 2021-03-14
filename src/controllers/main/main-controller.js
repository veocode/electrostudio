const Controller = load.class('controller');

class MainController extends Controller {

    boot() {
        this.loadForm('main');
    }

    start() {
        this.getForm('main').createWindow();
    }

}

module.exports = MainController;
