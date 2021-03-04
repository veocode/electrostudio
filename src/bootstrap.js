const Loader = require('./classes/loader');
const { app } = require('electron');

module.exports = function () {

    global.load = new Loader();
    global.app = app;

    global.config = load.config();
    global.errors = load.model('errors/exceptions');

    global.t = (text) => text; // future i18n placeholder

}
