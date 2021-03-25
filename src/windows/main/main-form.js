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

        const layout = this.createComponent('Layout', {
            orientation: 'row',
            alignment: 'client'
        });

        const paneToolbarProject = this.createComponent('LayoutPane', {
            fixedSize: 170
        });

        const paneToolbarComponents = this.createComponent('LayoutPane');

        layout.addChildren(paneToolbarProject, paneToolbarComponents);

        const toolbarProject = this.createComponent('ToolPanel', {
            alignment: 'client'
        });

        toolbarProject.addChildren(this.createComponent('ToolButton', {
            name: 'btnNewProject',
            icon: 'file-o',
            hint: t('New Project')
        }, {
            click: 'onBtnNewProjectClick'
        }));

        toolbarProject.addChildren(this.createComponent('ToolButton', {
            name: 'btnOpenProject',
            icon: 'folder-o',
            hint: t('Open Project')
        }));

        toolbarProject.addChildren(this.createComponent('ToolButton', {
            name: 'btnSaveProject',
            icon: 'floppy-o',
            hint: t('Save Project')
        }, {
            click: 'onBtnSaveProjectClick'
        }));

        paneToolbarProject.addChildren(toolbarProject);

        const toolbarComponents = this.createComponent('ToolPanel', {
            alignment: 'client'
        });

        for (const className of Object.keys(ComponentFactory.Library)) {
            toolbarComponents.addChildren(this.createComponent('ToolButton', {
                hint: t(className)
            }, {
                click: 'onBtnComponentPalleteClick'
            }));
        }

        paneToolbarComponents.addChildren(toolbarComponents);

        this.addChildren(layout);
    }

}

module.exports = MainForm;
