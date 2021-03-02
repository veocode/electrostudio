const Studio = load.singleton('studio');
const Controller = load.class('controller');
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

    }

    start() {
        const panel = Studio.createComponent('Panel');
        const button = Studio.createComponent('Button');

        panel.alignment = 'client';
        panel.addChildren(button);

        console.log(panel.getRenderedHTML());
    }

}

module.exports = MainController;
