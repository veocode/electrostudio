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

        const paneToolbarProject = this.createComponent('LayoutPane', { fixedSize: 130 });
        const paneToolbarComponents = this.createComponent('LayoutPane');
        layout.addChildren(paneToolbarProject, paneToolbarComponents);

        const toolbarProject = this.createComponent('ToolPanel', { alignment: 'client' });
        const toolbarComponents = this.createComponent('ToolPanel', { name: 'toolbarComponents', alignment: 'client', toggleable: true });

        paneToolbarProject.addChildren(toolbarProject);
        paneToolbarComponents.addChildren(toolbarComponents);

        toolbarProject.addChildren(this.createComponent('ToolButton', {
            name: 'btnSaveProject',
            icon: 'content-save',
            hint: t('Save Project')
        }, {
            click: 'onBtnSaveProjectClick'
        }));

        toolbarProject.addChildren(this.createComponent('ToolButton', {
            name: 'btnRunProject',
            icon: 'play-circle-outline',
            hint: t('Run Project')
        }, {
            click: 'onBtnRunProjectClick'
        }));

        for (const componentClass of Object.values(ComponentFactory.Library)) {
            if (componentClass.isInternal()) { continue; }

            const className = componentClass.name;
            const icon = componentClass.getIcon();
            const hint = componentClass.getTitle();

            toolbarComponents.addChildren(this.createComponent('ToolButton', {
                metaData: className,
                hint,
                icon
            }, {
                click: 'onBtnComponentPalleteClick'
            }));
        }

        this.addChildren(layout);
    }

}

module.exports = MainForm;
