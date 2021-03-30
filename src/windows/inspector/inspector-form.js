const Form = load.class('form');

class InspectorForm extends Form {

    getSchema() {
        return {
            name: 'inspector',
            title: t('Object Inspector'),
            left: 0,
            top: 120,
            width: 330,
            height: 550,
            resizable: true,
            maximizable: false,
            minimizable: false,
            isDebug: true
        };
    }

    buildComponents() {
        const layout = this.createComponent('Layout', {
            alignment: 'client',
            orientation: 'column'
        })

        const paneActions = this.createComponent('LayoutPane', {
            fixedSize: 50
        });

        const paneEditor = this.createComponent('LayoutPane');

        const actionPanel = this.createComponent('ToolPanel', {
            name: 'actionPanel',
            alignment: 'client',
            height: 50
        })

        const editor = this.createComponent('InspectorPropertyEditor', {
            name: 'editor'
        });

        paneActions.addChildren(actionPanel);
        paneEditor.addChildren(editor);
        layout.addChildren(paneActions, paneEditor);

        this.addChildren(layout);
    }


}

module.exports = InspectorForm;
