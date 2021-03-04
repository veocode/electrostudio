const Studio = load.singleton('studio');
const Controller = load.class('controller');
const Window = load.class('window');

class MainController extends Controller {

    window = new Window('main', {
        formName: 'main',
        x: 0,
        y: 0,
        width: '100%',
        height: 100,
        resizable: false,
        maximizable: false,
        menu: null,
        isDebug: true
    });

    boot() {

    }

    start() {

    }

}

module.exports = MainController;
