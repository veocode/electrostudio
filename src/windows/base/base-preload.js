const path = require('path');
const { contextBridge, ipcRenderer } = require("electron");
const Loader = require('../../classes/loader');

const rootDir = path.resolve(__dirname, '../..');
const load = new Loader(rootDir);
const Window = load.class('window');

const urlParams = new URLSearchParams(location.search);
const windowName = urlParams.get('name');
const windowOptions = JSON.parse(urlParams.get('options'));

contextBridge.exposeInMainWorld("view", {
    getHTML() {
        return Window.getViewHTML(windowName)
    },
});

contextBridge.exposeInMainWorld("meta", Object.assign({ name: windowName }, windowOptions));
