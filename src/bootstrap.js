const Loader = require('./classes/loader');
const { app } = require('electron');
const SettingStorage = require('electron-store');

module.exports = function () {

    globalThis.load = new Loader();
    globalThis.app = app;

    globalThis.config = load.config();
    globalThis.settings = new SettingStorage();
    globalThis.errors = load.model('errors/exceptions');

    globalThis.t = (text) => text; // future i18n placeholder

}
