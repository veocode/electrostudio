const Window = load.class('window');
const Utils = load.class('utils');
const interact = load.node('interactjs');

class DesignerWindow extends Window {

    static SnapSize = 10;
    static MinSize = { width: 10, height: 10 };

    projectService = this.getService('studio/project');

    formComponent = null;
    selectedComponent = null;
    selectedComponentClassToCreate = null;

    async start() {
        this.bindEvents();
        await this.displayActiveProjectForm();
    }

    bindEvents() {
        this.form.on('component:prop-updated', (payload) => {
            const { propertyName, previousValue, value } = payload;
            if (this.isFormSelected()) {
                this.updateFormPropertyValue(propertyName, previousValue, value);
            } else {
                this.updateSelectedComponentPropertyValue(propertyName, previousValue, value);
            }
        });

        this.form.on('component:event-updated', (payload) => {
            const { eventName, previousHandlerName, handlerName } = payload;
            if (this.isFormSelected()) {
                this.updateFormEventValue(eventName, previousHandlerName, handlerName);
            } else {
                this.updateSelectedComponentEventValue(eventName, previousHandlerName, handlerName);
            }
        });

        this.form.on('component:parent-selected', () => {
            if (this.selectedComponent && this.selectedComponent.parent) {
                const parent = this.selectedComponent.parent;
                this.deselectComponent();
                this.selectComponent(parent);
            }
        });

        this.form.on('component:class-selected', className => {
            this.deselectComponent();
            this.selectedComponentClassToCreate = className;
        });

        this.form.on('component:class-deselected', () => {
            this.selectedComponentClassToCreate = null;
        });

        this.form.on('component:action', (methodName) => {
            this.selectedComponent.callAction(methodName, this);
        });
    }

    async displayActiveProjectForm() {
        const currentFormSchema = await this.projectService.getActiveFormSchema();
        const currentFormComponentSchemas = await this.projectService.getActiveFormComponents();

        this.formComponent = this.form.createComponent('Form', currentFormSchema);
        this.form.replaceFormComponent(this.formComponent);

        this.applyFormSchemaToWindow();
        this.buildFormComponents(currentFormComponentSchemas);
        this.bindComponentEvents();
        this.displayForm();
    }

    applyFormSchemaToWindow() {
        const formProps = this.formComponent.getSchema(false).properties;
        this.setTitle(formProps.title);
        this.form.setSize(formProps.width, formProps.height);
        this.form.setResizable(formProps.resizable);
        this.form.setMinimizable(formProps.minimizable);
        this.form.setMaximizable(formProps.maximizable);
    }

    buildFormComponents(childrenSchema) {
        this.form.buildComponentsFromSchemaList(childrenSchema);
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
            this.onComponentClick(this.formComponent, event.offsetX, event.offsetY);
        });

        window.addEventListener('resize', event => {
            if (!this.formComponent) { return; }
            this.formComponent.width = window.innerWidth;
            this.formComponent.height = window.innerHeight;
            this.onComponentClick(this.formComponent, event.offsetX, event.offsetY);
            this.updateFormInProject();
        });

        window.addEventListener('keydown', event => {
            if (event.key == 'Delete' && this.isComponentSelected()) {
                this.deleteSelectedComponent();
            }
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
                this.onComponentClick(component, event.offsetX, event.offsetY);
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
            margin: 10,
            modifiers: [
                interact.modifiers.snap({
                    targets: [
                        interact.snappers.grid({ x: snapSize, y: snapSize }),
                    ],
                })
            ],
            listeners: {
                start: () => {
                    if (this.selectedComponent != component) {
                        this.deselectComponent();
                        this.selectComponent(component);
                    }
                },
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
                    this.deselectComponent();
                    this.selectComponent(component);
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

    onComponentClick(component, x, y) {
        if (this.isAddingComponent()) {
            if (component.isContainer()) {
                this.createChildrenIn(component, x, y);
            }
            return;
        }
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
        if (this.isComponentSelected() && this.selectedComponent == component) {
            return;
        }

        let parentComponentSchema = null;
        if (!this.isFormSelected() && component.parent) {
            const schema = component.parent.getSchema(false);
            if (schema.className != 'Form') {
                parentComponentSchema = schema;
            }
        }

        this.form.emit('component:selected', {
            componentSchema: component.getSchema(false),
            actions: component.getDesignerActions(),
            parentComponentSchema
        });

        this.selectedComponent = component;
        this.toggleComponentSelection(true);
    }

    toggleComponentSelection(isSelected) {
        this.selectedComponent.getDOM().toggleClass('selected', isSelected);
    }

    isComponentSelected() {
        return this.selectedComponent != null;
    }

    isFormSelected() {
        return this.isComponentSelected() && this.selectedComponent == this.formComponent;
    }

    getActiveFormComponentSchema() {
        return this.formComponent.getSchema(false);
    }

    updateFormInProject() {
        const formSchema = this.formComponent.getSchema();
        const componentSchemas = formSchema.children;
        this.projectService.updateActiveForm(formSchema, componentSchemas);
    }

    updateSelectedComponentPropertyValue(propertyName, previousValue, value) {
        const component = this.selectedComponent;
        component.setPropertyValue(propertyName, value);

        if (component.parent && component.isRebuildParentOnPropertyUpdate(propertyName, value)) {
            this.rebuildComponent(component.parent);
            return;
        }

        this.rebuildComponent(component);

        if (component.hasChildren() && component.isRebuildChildrenOnPropertyUpdate(propertyName, value)) {
            for (let childrenComponent of component.getChildren()) {
                this.rebuildComponent(childrenComponent);
            }
        }
    }

    updateSelectedComponentEventValue(eventName, previousHandlerName, handlerName) {
        this.selectedComponent.setEventHandler(eventName, handlerName);
        this.updateFormInProject();
    }

    updateFormPropertyValue(propertyName, previousValue, value) {
        this.formComponent[propertyName] = value;
        this.applyFormSchemaToWindow();
        this.updateFormInProject();
    }

    updateFormEventValue(eventName, previousHandlerName, handlerName) {
        this.formComponent.setEventHandler(eventName, handlerName);
        this.updateFormInProject();
    }

    isAddingComponent() {
        return this.selectedComponentClassToCreate != null;
    }

    createChildrenIn(parentComponent, x, y) {
        if (!parentComponent.isContainer()) { return; }
        if (!this.selectedComponentClassToCreate) { return; }

        const className = this.selectedComponentClassToCreate;
        const left = Utils.snap(x, DesignerWindow.snapSize);
        const top = Utils.snap(y, DesignerWindow.snapSize);

        const component = this.form.createComponent(className, { left, top });

        parentComponent.addChildren(component);
        this.registerComponentEvents(component);
        this.rebuildComponent(parentComponent);
        this.finishComponentAdding();
        this.selectComponent(component);
    }

    finishComponentAdding() {
        this.selectedComponentClassToCreate = null;
        this.form.emit('component:added');
    }

    deleteSelectedComponent() {
        if (!this.isComponentSelected()) { return; }
        if (this.isFormSelected()) { return; }

        const component = this.selectedComponent;

        this.form.deleteChildren(component)
        this.deselectComponent();
        component.getDOM().remove();

        this.updateFormInProject();
    }

}

module.exports = DesignerWindow;