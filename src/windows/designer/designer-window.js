const Window = load.class('window');

class DesignerWindow extends Window {

    projectService = this.getService('project');
    currentFormSchema = {};

    async start() {
        await this.displayActiveProjectForm();
    }

    async displayActiveProjectForm() {
        const currentFormSchema = await this.projectService.getActiveFormSchema();
        const currentFormComponents = await this.projectService.getActiveFormComponents();
        this.applyFormSchemaToWindow(currentFormSchema);
        this.buildFormComponents(currentFormComponents);
        this.bindComponentEvents();
        this.displayForm();
    }

    applyFormSchemaToWindow(schema, components) {
        this.setTitle(schema.title);
        this.form.setSize(schema.width, schema.height);
        this.form.setResizable(schema.resizable);
    }

    buildFormComponents(componentSchemaList) {
        this.form.buildComponentsFromSchemaList(componentSchemaList);
    }

    bindComponentEvents() {
        const components = this.form.getComponentsList();
        for (let component of components) {
            component.getDOM($).on('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                this.onComponentClick(component);
            })
        }
    }

    onComponentClick(component) {
        console.log('Clicked: ' + component.name);
    }

}

module.exports = DesignerWindow;