const Controller = load.class('controller')
const Window = load.class('window');

class MainController extends Controller {

    window = new Window('main', {
        x: 0,
        y: 0,
        width: '100%',
        height: 120,
        resizable: false,
        maximizable: false,
        menu: null,
        isDebug: true
    });

    boot() {
        console.log('BOOT MAIN CONTROLLER');
    }

    start() {
        console.log('START MAIN CONTROLLER');
    }

}

module.exports = MainController;
