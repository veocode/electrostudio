const Form = load.class('form');

class MainForm extends Form {

    build() {

        const panel = this.createRootComponent('ToolPanel', {
            alignment: 'client'
        });

        const btnNewProject = this.createComponent('ToolButton', {
            name: 'btnNewProject',
            icon: 'file-o',
            hint: t('New Project')
        });

        const btnOpenProject = this.createComponent('ToolButton', {
            name: 'btnOpenProject',
            icon: 'folder-o',
            hint: t('Open Project')
        });

        const btnSaveProject = this.createComponent('ToolButton', {
            name: 'btnSaveProject',
            icon: 'floppy-o',
            hint: t('Save Project')
        });

        panel.addChildren(btnNewProject, btnOpenProject, btnSaveProject);

    }

}

module.exports = MainForm;
