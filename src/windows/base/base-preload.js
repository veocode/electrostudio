require('../../bootstrap')();

const path = load.node('path');
const { contextBridge, ipcRenderer } = load.node("electron");

const urlParams = new URLSearchParams(location.search);

const windowName = urlParams.get('name');
const windowOptions = JSON.parse(urlParams.get('options'));

const windowMeta = Object.assign({ name: windowName }, windowOptions);
contextBridge.exposeInMainWorld("meta", windowMeta);

const clientWindowForm = load.form(windowName);
const clientWindowHandler = load.clientWindow(windowName, clientWindowForm);
contextBridge.exposeInMainWorld("handler", {
    getHTML() {
        return clientWindowHandler.getFormRenderedHTML();
    },
    onFormEvent(event, callback) {
        return clientWindowForm.events.on(event, callback);
    }
});

contextBridge.exposeInMainWorld("size", {
    minimize() {
        console.log('minimize');
    },
    maximize() {
        console.log('maximize');
    }
});
