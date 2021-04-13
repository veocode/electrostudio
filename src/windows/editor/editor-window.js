const Window = load.class('window');

class EditorWindow extends Window {

    studioService = this.getService('studio/studio');

    start() {
        this.bindEvents();
        this.bindEditorEvents();

        const filePath = this.payload.filePath;
        this.editor.openFile(filePath);
    }

    bindEvents() {
        this.form.on('file:method-add', payload => {
            const { methodName, methodArgs, methodBody } = payload;
            this.insertMethod(methodName, methodArgs, methodBody);
        });
    }

    bindEditorEvents() {
        this.editor.events.on('file:save', (filePath, content) => {
            this.form.emit('file:save', { filePath, content });
        });
    }

    insertMethod(methodName, methodArgs, methodBody) {
        const code = this.editor.getValue();
        const insertRegEx = new RegExp(/}\n?\s?module\.exports\s=/);
        const methodSignature = `${methodName}(${methodArgs})`;
        const insertReplace = [
            '',
            `\t${methodSignature} {`,
            `\t\t${methodBody}`,
            `\t}`,
            '',
            '}',
            '',
            'module.exports ='
        ].join('\n');

        const match = code.match(insertRegEx);
        const updatedCode = code.replace(match[0], insertReplace);

        this.editor.setValue(updatedCode);
    }

}

module.exports = EditorWindow;