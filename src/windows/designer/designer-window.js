const Window = load.class('window');
const interact = load.node('interactjs');

class DesignerWindow extends Window {

    projectService = this.getService('project');
    currentFormSchema = {};

    async start() {
        await this.displayActiveProjectForm();
    }

    async displayActiveProjectForm() {
        const currentFormSchema = await this.projectService.getActiveFormSchema();
        const currentFormComponentSchemas = await this.projectService.getActiveFormComponents();
        this.applyFormSchemaToWindow(currentFormSchema);
        this.buildFormComponents(currentFormComponentSchemas);
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

    registerComponentEvents(component) {
        this.bindComponentEvents(component);
        return;
    }

    bindComponentEvents(...components) {
        if (!components.length) {
            components = this.form.getComponentsList();
        }
        for (let component of components) {
            const $componentDOM = component.getDOM($);

            $componentDOM.on('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onComponentClick(component);
            })

            interact($componentDOM[0]).draggable({
                modifiers: [
                    interact.modifiers.snap({
                        targets: [
                            interact.snappers.grid({ x: 10, y: 10 }),
                        ],
                    })
                ],
                listeners: {
                    move: event => {
                        component.left += Math.ceil(event.dx / 10) * 10;
                        component.top += Math.ceil(event.dy / 10) * 10;

                        event.target.style.transform =
                            `translate(${component.left}px, ${component.top}px)`
                    },
                    end: event => {
                        component.left += event.dx;
                        component.top += event.dy;
                        this.rebuildComponent(component);
                    }
                }
            })
        }
    }

    onComponentClick(component) {
        console.log('Clicked: ' + component.name);
    }

}

module.exports = DesignerWindow;