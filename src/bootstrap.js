const Loader = require('./classes/loader');
const { app } = require('electron');
const Store = require('electron-store');

module.exports = function () {

    globalThis.load = new Loader();
    globalThis.app = app;

    globalThis.config = load.config();
    globalThis.settings = new Store();
    globalThis.errors = load.model('errors/exceptions');

    globalThis.t = (text) => text; // future i18n placeholder

}
