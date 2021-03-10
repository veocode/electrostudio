require('../../bootstrap')();

const path = load.node('path');
const query = new URLSearchParams(location.search);

const windowName = query.get('name');
const windowOptions = JSON.parse(query.get('options'));

window.handler = load.window(windowName, windowOptions);

window.process.on('uncaughtException', (error) => {
    window.handler.onError(error);
});
