require('../../bootstrap')();

const path = load.node('path');
const query = new URLSearchParams(location.search);

const windowName = query.get('name');
const windowOptions = JSON.parse(query.get('options'));
const windowPayload = JSON.parse(query.get('payload'));

window.ipc = load.electron('ipcRenderer');

window.handler = load.window(windowName, windowOptions, windowPayload);

window.process.on('uncaughtException', (error) => {
    window.handler.onError(error);
});
