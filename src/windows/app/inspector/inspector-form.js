const Form = load.class('form');

class InspectorForm extends Form {

    getSchema() {
        return {
            name: 'app/inspector',
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

        const paneActions = this.createComponent('LayoutPane', { fixedSize: 50 });
        const paneTabs = this.createComponent('LayoutPane');

        const tabs = this.createComponent('Tabs', { alignment: 'client' });
        const tabPropEditor = this.createComponent('TabPane', { label: 'Properties' });
        const tabEventEditor = this.createComponent('TabPane', { label: 'Events' });
        tabs.addChildren(tabPropEditor, tabEventEditor);
        paneTabs.addChildren(tabs);

        const actionPanel = this.createComponent('ToolPanel', {
            name: 'actionPanel',
            alignment: 'client',
            height: 50
        })

        const propEditor = this.createComponent('InspectorPropertyEditor', {
            name: 'propEditor'
        });
        tabPropEditor.addChildren(propEditor);

        const eventEditor = this.createComponent('InspectorEventEditor', {
            name: 'eventEditor'
        });
        tabEventEditor.addChildren(eventEditor);

        paneActions.addChildren(actionPanel);
        paneTabs.addChildren(tabs);
        layout.addChildren(paneTabs, paneActions);

        this.addChildren(layout);
    }

}

module.exports = InspectorForm;
