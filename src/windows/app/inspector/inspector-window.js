const Window = load.class('window');
const Utils = load.class('utils');

class InspectorWindow extends Window {

    start() {
        this.initPropEditor();
        this.initEventEditor();
        this.bindEvents();
    }

    initPropEditor() {
        this.propEditor.events.on('input-result', (prop, previousValue, value) => {
            this.form.emit('component:prop-updated', {
                propertyName: prop.name,
                previousValue,
                value
            });
        });

        this.propEditor.events.on('input-error', (message) => {
            alert(`${t('Validation Error')}: ${message}`);
        });

        this.propEditor.events.on('parent-selected', (name) => {
            this.form.emit('component:parent-selected', name);
        });
    }

    initEventEditor() {
        this.eventEditor.events.on('input-result', (eventName, previousHandlerName, handlerName) => {
            this.form.emit('component:event-updated', {
                eventName,
                previousHandlerName,
                handlerName
            });
        });

        this.eventEditor.events.on('input-error', (message) => {
            alert(`${t('Validation Error')}: ${message}`);
        });

        this.eventEditor.events.on('input-auto', (componentName, className, eventName) => {
            this.form.emit('component:event-auto-create', { componentName, className, eventName });
        });
    }

    bindEvents() {
        this.form.on('component:show', (payload) => {
            const { componentSchema, actions, parentComponentSchema } = payload;
            this.buildActionButtons(actions);
            this.eventEditor.setSchema(componentSchema);
            this.propEditor.setSchema(componentSchema);
            if (parentComponentSchema !== null) {
                this.propEditor.setParentSchema(parentComponentSchema);
            }
        })

        this.form.on('component:hide', (payload) => {
            this.propEditor.clearSchema();
            this.eventEditor.clearSchema();
        })

        this.form.on('component:event-updated', (payload) => {
            this.eventEditor.setEventHandlerName(payload.eventName, payload.handlerName);
        })
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