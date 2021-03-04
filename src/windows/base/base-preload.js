require('../../bootstrap')();

const path = load.node('path');
const { contextBridge, ipcRenderer } = load.node("electron");

const urlParams = new URLSearchParams(location.search);

const windowName = urlParams.get('name');
const windowOptions = JSON.parse(urlParams.get('options'));

const windowMeta = Object.assign({ name: windowName }, windowOptions);
contextBridge.exposeInMainWorld("meta", windowMeta);

const clientWindowHandler = load.clientWindow(windowName, load.form(windowMeta.formName));
contextBridge.exposeInMainWorld("handler", {
    getHTML() {
        return clientWindowHandler.getFormRenderedHTML();
    }
});
