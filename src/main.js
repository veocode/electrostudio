const bootstrap = require('./bootstrap');
const { app } = require('electron')

const unhandled = require('electron-unhandled');
unhandled();

app.whenReady().then(() => {

    bootstrap();

    const mainController = load.controller(config.mainControllerName);
    mainController.run();

})

app.on('window-all-closed', () => {
    app.quit()
})
