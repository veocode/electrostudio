const Window = load.class('window');

class InspectorWindow extends Window {

    editor;

    start() {
        this.initEditor();
        this.bindEvents();
    }

    initEditor() {
        this.editor.setCallbacks({
            result: (prop, previousValue, value) => {
                this.form.emit('component:prop-updated', {
                    propertyName: prop.name,
                    previousValue,
                    value
                });
            },
            parentSelected: (name) => {
                this.form.emit('component:parent-selected', name);
            }
        });
    }

    bindEvents() {
        this.form.on('component:show', (payload) => {
            const { componentSchema, actions, parentComponentSchema } = payload;
            this.buildActionButtons(actions);
            this.editor.setSchema(componentSchema);
            if (parentComponentSchema !== null) {
                this.editor.setParentSchema(parentComponentSchema);
            }
        });

        this.form.on('component:hide', (payload) => {
            this.editor.clearSchema();
        });
    }

    buildActionButtons(actions) {
        this.actionPanel.removeChildren();

        if (!actions || !Object.keys(actions).length) {
            return;
        }

        for (let [methodName, actionParams] of Object.entries(actions)) {
            const button = this.form.createComponent('ToolButton', {
                icon: actionParams.icon,
                hint: actionParams.title,
                metaData: methodName
            }, {
                click: 'onActionPanelButtonClick'
            });

            this.actionPanel.addChildren(button);
        }

    }

    onActionPanelButtonClick(event, senderButton) {
        const methodName = senderButton.metaData;
        this.form.emit('component:action', methodName);
    }

}

module.exports = InspectorWindow;