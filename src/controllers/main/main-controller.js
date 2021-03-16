const Controller = load.class('controller');

class MainController extends Controller {

    boot() {

    }

    start() {
        this.createFormWindow('main');
    }

}

module.exports = MainController;