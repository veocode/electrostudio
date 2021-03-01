const { app, screen } = require('electron')
const Loader = require('./classes/loader')

app.whenReady().then(() => {

    global.rootDir = __dirname;
    global.load = new Loader(rootDir);
    global.config = load.config();
    global.app = app;

    console.log(config.screenSize);

    const mainController = load.controller(config.mainControllerName);
    mainController.run();

})

app.on('window-all-closed', () => {
    app.quit()
})
