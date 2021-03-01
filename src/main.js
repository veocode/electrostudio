const { app, screen } = require('electron')
const Loader = require('./classes/loader')

app.whenReady().then(() => {

    global.load = new Loader();
    global.config = load.config();
    global.app = app;

    const mainController = load.controller(config.mainControllerName);
    mainController.run();

})

app.on('window-all-closed', () => {
    app.quit()
})
