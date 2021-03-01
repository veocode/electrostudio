const Loader = require('../../classes/loader');
const load = new Loader();

const path = load.node('path');
const { contextBridge, ipcRenderer } = load.node("electron");

const urlParams = new URLSearchParams(location.search);
const windowName = urlParams.get('name');
const windowOptions = JSON.parse(urlParams.get('options'));
const windowMeta = Object.assign({ name: windowName }, windowOptions);

contextBridge.exposeInMainWorld("view", {
    getHTML() {
        return load.class('window').getViewHTML(windowName)
    },
    getStylesURL() {
        return `../${windowName}/${windowName}-window.css`
    },
    getScriptURL() {
        return `../${windowName}/${windowName}-window.js`
    }
});

contextBridge.exposeInMainWorld("meta", windowMeta);
