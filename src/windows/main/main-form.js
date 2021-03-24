const Form = load.class('form');
const { ComponentFactory } = load.class('factories');

class MainForm extends Form {

    getSchema() {
        return {
            name: 'main',
            title: config.appTitle,
            left: 0,
            top: 0,
            width: '100%',
            height: 60,
            resizable: false,
            maximizable: false,
            isDebug: true
        };
    }

    buildComponents() {
        const panel = this.createComponent('ToolPanel', {
            alignment: 'client'
        });

        panel.addChildren(this.createComponent('ToolButton', {
            name: 'btnNewProject',
            icon: 'file-o',
            hint: t('New Project')
        }, {
            click: 'onBtnNewProjectClick'
        }));

        panel.addChildren(this.createComponent('ToolButton', {
            name: 'btnOpenProject',
            icon: 'folder-o',
            hint: t('Open Project')
        }));

        panel.addChildren(this.createComponent('ToolButton', {
            name: 'btnSaveProject',
            icon: 'floppy-o',
            hint: t('Save Project')
        }, {
            click: 'onBtnSaveProjectClick'
        }));

        for (const className of Object.keys(ComponentFactory.Library)) {
            panel.addChildren(this.createComponent('ToolButton', {
                hint: t(className)
            }, {
                click: 'onBtnComponentPalleteClick'
            }));
        }

        this.addChildren(panel);
    }

}

module.exports = MainForm;
