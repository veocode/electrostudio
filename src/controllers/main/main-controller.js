const Controller = load.class('controller');

class MainController extends Controller {

    // window = new Window('main', {
    //     formName: 'main',
    //     x: 0,
    //     y: 0,
    //     width: '100%',
    //     height: 90,
    //     resizable: false,
    //     maximizable: false,
    //     menu: null,
    //     isDebug: true
    // });

    form = load.form('main');

}

module.exports = MainController;
