const Form = load.class('form');

class MainForm extends Form {

    buildForm() {
        return this.createComponent('Form', {
            name: 'MainForm',
            title: config.appTitle,
            x: 0,
            y: 0,
            width: '100%',
            height: 90,
            resizable: false,
            maximizable: false,
        });
    }

    build() {
        const panel = this.createComponent('ToolPanel', {
            alignment: 'client'
        });

        panel.addChildren(this.createComponent('ToolButton', {
            name: 'btnNewProject',
            icon: 'file-o',
            hint: t('New Project')
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
        }));

        this.addChildren(panel);
    }

}

module.exports = MainForm;
