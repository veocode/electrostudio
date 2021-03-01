const { screen } = load.node('electron')

module.exports = {
    appTitle: 'Electron Studio',
    mainControllerName: 'main',
    screenSize: screen.getPrimaryDisplay().workAreaSize
}
