const Window = load.class('window');

class DesignerWindow extends Window {

    projectService = this.getService('project');
    currentFormSchema = {};

    async start() {
        const currentFormSchema = await this.projectService.getActiveFormSchema();
        const currentFormComponents = await this.projectService.getActiveFormComponents();
        this.applyFormSchemaToWindow(currentFormSchema);
        this.buildFormComponents(currentFormComponents);
    }

    applyFormSchemaToWindow(schema, components) {
        this.setTitle(schema.title);
        this.form.setSize(schema.width, schema.height);
        this.form.setResizable(schema.resizable);
    }

    buildFormComponents(componentSchemaList) {
        this.form.buildComponentsFromSchemaList(componentSchemaList);
        this.displayForm();
    }

}

module.exports = DesignerWindow;