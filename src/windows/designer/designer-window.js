const Window = load.class('window');
const Utils = load.class('utils');
const interact = load.node('interactjs');

class DesignerWindow extends Window {

    static SnapSize = 10;
    static MinSize = { width: 10, height: 10 };

    projectService = this.getService('project');

    currentFormSchema = {};
    currentFormComponentSchemas = {};

    selectedComponent;

    async start() {
        await this.displayActiveProjectForm();
    }

    async displayActiveProjectForm() {
        this.currentFormSchema = await this.projectService.getActiveFormSchema();
        this.currentFormComponentSchemas = await this.projectService.getActiveFormComponents();
        this.applyFormSchemaToWindow();
        this.buildFormComponents(this.currentFormComponentSchemas);
        this.bindComponentEvents();
        this.displayForm();
    }

    applyFormSchemaToWindow() {
        const schema = this.currentFormSchema;
        this.setTitle(schema.title);
        this.form.setSize(schema.width, schema.height);
        this.form.setResizable(schema.resizable);
    }

    buildFormComponents(componentSchemaList) {
        this.form.buildComponentsFromSchemaList(this.currentFormComponentSchemas);
    }

    rebuildComponent(component) {
        super.rebuildComponent(component);
        if (this.selectedComponent == component) {
            this.toggleComponentSelection(true);
        }
        this.updateFormInProject();
    }

    registerFormEvents() {
        this.dom.$body.on('click', event => {
            this.selectFormComponent();
        });
        window.addEventListener('resize', event => {
            this.selectFormComponent();
        });
    }

    registerComponentEvents(component) {
        this.bindComponentEvents(component);
    }

    bindComponentEvents(...components) {
        if (!components.length) {
            components = this.form.getComponentsList();
        }
        for (let component of components) {
            const $componentDOM = component.getDOM();

            $componentDOM.on('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
            })

            $componentDOM.on('mousedown', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onComponentClick(component);
            })

            if (component.isDraggable()) {
                this.bindComponentDraggable(component);
            }

            if (component.isResizable()) {
                this.bindComponentResizable(component);
            }
        }
    }

    bindComponentResizable(component) {
        const snapSize = DesignerWindow.SnapSize;
        const minSize = DesignerWindow.MinSize;
        const $componentDOM = component.getDOM();

        interact($componentDOM[0]).resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        interact.snappers.grid({ x: snapSize, y: snapSize }),
                    ],
                })
            ],
            listeners: {
                move: event => {
                    const translateX = (parseFloat(event.target.dataset.x) || 0) + Utils.snap(event.deltaRect.left);
                    const translateY = (parseFloat(event.target.dataset.y) || 0) + Utils.snap(event.deltaRect.top);

                    component.width = Utils.snap(Math.max(event.rect.width, minSize.width), snapSize);
                    component.height = Utils.snap(Math.max(event.rect.height, minSize.height), snapSize);

                    Object.assign(event.target.style, {
                        width: `${component.width}px`,
                        height: `${component.height}px`,
                        transform: `translate(${translateX}px, ${translateY}px)`
                    })

                    Object.assign(event.target.dataset, { x: translateX, y: translateY })
                },
                end: event => {
                    const translateX = (parseFloat(event.target.dataset.x) || 0);
                    const translateY = (parseFloat(event.target.dataset.y) || 0);
                    component.left += translateX;
                    component.top += translateY;
                    this.rebuildComponent(component);
                }
            }
        })
    }

    bindComponentDraggable(component) {
        const snapSize = DesignerWindow.SnapSize;
        const $componentDOM = component.getDOM();

        interact($componentDOM[0]).draggable({
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        interact.snappers.grid({ x: snapSize, y: snapSize }),
                    ],
                })
            ],
            listeners: {
                start: () => {
                    component.setMeta('currentPosition', {
                        left: component.left,
                        top: component.top
                    });
                },
                move: event => {
                    const dx = Utils.snap(event.dx, snapSize);
                    const dy = Utils.snap(event.dy, snapSize);

                    component.left += dx;
                    component.top += dy;

                    const currentPosition = component.getMeta('currentPosition', {
                        left: component.left,
                        top: component.top
                    });

                    const translateLeft = component.left - currentPosition.left;
                    const translateTop = component.top - currentPosition.top;

                    event.target.style.transform = `translate(${translateLeft}px, ${translateTop}px)`;
                },
                end: () => {
                    component.deleteMeta('currentPosition');
                    this.rebuildComponent(component);
                }
            }
        });
    }

    onComponentClick(component) {
        this.deselectComponent();
        this.selectComponent(component);
    }

    deselectComponent() {
        if (!this.selectedComponent) { return; }
        this.form.emit('component:deselected', this.selectedComponent.getPropertiesValues())
        this.toggleComponentSelection(false);
        this.selectedComponent = null;
    }

    selectComponent(component) {
        this.selectedComponent = component;
        this.toggleComponentSelection(true);
        this.form.emit('component:selected', this.selectedComponent.getSchema(false));
    }

    toggleComponentSelection(isSelected) {
        this.selectedComponent.getDOM().toggleClass('selected', isSelected);
    }

    selectFormComponent() {
        this.deselectComponent();
        this.form.emit('component:selected', this.getActiveFormComponentSchema());
    }

    getActiveFormComponentSchema() {
        return {
            className: 'Form',
            properties: this.currentFormSchema
        };
    }

    updateFormInProject() {
        const componentSchemas = this.form.getChildrenSchema();
        this.projectService.updateActiveForm(this.currentFormSchema, componentSchemas);
    }

}

module.exports = DesignerWindow;