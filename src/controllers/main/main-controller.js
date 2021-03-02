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

    }

    start() {
        const Components = load.components();
        const panel = new Components.Panel();
        const button = new Components.Button();
        button.label = 'Click Me!';
        panel.alignment = 'client';
        panel.addChildren(button);
        const html = panel.getRenderedHTML();
        console.log(html);
    }

}

module.exports = MainController;
