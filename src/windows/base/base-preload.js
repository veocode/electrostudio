require('../../bootstrap')();

const path = load.node('path');
const query = new URLSearchParams(location.search);

const windowName = query.get('name');
const windowOptions = JSON.parse(query.get('options'));

window.meta = Object.assign({ name: windowName }, windowOptions);
window.form = load.form(windowName);
window.handler = load.clientWindow(windowName, window.form);
