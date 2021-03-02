const { app, screen } = require('electron')
const Loader = require('./classes/loader')
const unhandled = require('electron-unhandled');

unhandled();

app.whenReady().then(() => {

    global.load = new Loader();
    global.config = load.config();
    global.errors = load.model('errors/exceptions');
    global.app = app;

    global.t = (text) => text; // future i18n placeholder

    const mainController = load.controller(config.mainControllerName);
    mainController.run();

})

app.on('window-all-closed', () => {
    app.quit()
})
