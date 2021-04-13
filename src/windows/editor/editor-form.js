const Form = load.class('form');

class EditorForm extends Form {

    getSchema() {
        return {
            name: 'editor',
            title: t('Code Editor'),
            left: 440,
            top: 160,
            width: 640,
            height: 480,
            resizable: true,
            maximizable: true,
            minimizable: true,
            // isDebug: true
        };
    }

    buildComponents() {
        const editor = this.createComponent('CodeEditor', {
            name: 'editor',
            alignment: 'client'
        });

        this.addChildren(editor);
    }

}

module.exports = EditorForm;
