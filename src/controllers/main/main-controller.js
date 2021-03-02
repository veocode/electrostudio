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
        button.name = 'Button1';
        button.label = 'Click Me!';
        panel.name = 'Panel1';
        panel.width = 200;
        panel.height = 100;
        panel.alignment = 'client';
        panel.addChildren(button);
        const html = panel.getRenderedHTML();
        console.log(html);
    }

}

module.exports = MainController;
