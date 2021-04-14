const Window = load.class('window');
const path = load.node('path');

class EditorWindow extends Window {

    studioService = this.getService('studio/studio');

    start() {
        this.bindFormEvents();
        this.bindWindowEvents();
        this.bindEditorEvents();

        const filePath = this.payload.filePath;
        this.setTitleDocument(path.basename(filePath));
        this.editor.openFile(filePath);
    }

    bindFormEvents() {
        this.form.on('file:method-add', payload => {
            const { methodName, methodArgs, methodBody } = payload;
            this.insertMethod(methodName, methodArgs, methodBody);
        });
    }

    bindWindowEvents() {
        window.addEventListener('focus', () => {
            this.editor.setFocus();
        });
    }

    bindEditorEvents() {
        this.editor.events.on('file:save', (filePath, content) => {
            this.form.emit('file:save', { filePath, content });
            this.setTitleDirty(false);
        });

        this.editor.events.on('file:dirty-changed', (isDirty) => {
            this.setTitleDirty(isDirty);
        });
    }

    insertMethod(methodName, methodArgs, methodBody) {
        const code = this.editor.getValue();
        const insertRegEx = new RegExp(/}([\r\n\s\t]*)module\.exports\s?=/);
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

        if (match) {
            const updatedCode = code.replace(match[0], insertReplace);
            this.editor.setValue(updatedCode);
            this.editor.selectLine(this.editor.getLineCount() - 5, 3);
        }
    }

}

module.exports = EditorWindow;