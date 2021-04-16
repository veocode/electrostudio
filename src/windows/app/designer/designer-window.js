const Window = load.class('window');
const Utils = load.class('utils');
const interact = load.node('interactjs');

class DesignerWindow extends Window {

    static SnapSize = 10;
    static MinSize = { width: 10, height: 10 };

    projectService = this.getService('studio/project');

    formComponent;
    selectedComponent;
    selectedComponentClassToCreate;
    copiedComponentSchema;

    async start() {
        this.bindEvents();
        this.bindShortcuts();
        await this.displayActiveProjectForm();
    }

    bindShortcuts() {
        this.onShortcut(['ctrl+s', 'command+s'], () => {
            this.form.emit('project:save');
        });
        this.onShortcut(['ctrl+d', 'command+d'], () => {
            this.duplicateSelectedComponent();
        });
        this.onShortcut(['ctrl+c', 'command+c'], () => {
            this.copySelectedComponent();
        });
        this.onShortcut(['ctrl+v', 'command+v'], () => {
            this.pasteComponent();
        });
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
            this.startComponentCreating(className);
        });

        this.form.on('component:class-deselected', () => {
            this.selectedComponentClassToCreate = null;
        });

        this.form.on('component:action', (methodName) => {
            this.selectedComponent.callAction(methodName, this);
        });
    }

    async displayActiveProjectForm() {
        const currentFormSchema = this.payload.schema;
        const currentFormComponentSchemas = this.payload.components;

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
        this.setBackground(formProps.backgroundColor);
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

            $componentDOM.on('dblclick', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onComponentDoubleClick(component, event.offsetX, event.offsetY);
            })

            $componentDOM.on('mousedown', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onComponentClick(component, event.offsetX, event.offsetY);
            })

            if (component.isDraggable()) {
                this.makeComponentDraggable(component);
            }

            if (component.isResizable()) {
                this.makeComponentResizable(component);
            }
        }
    }

    makeComponentResizable(component) {
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

    makeComponentDraggable(component) {
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

    onComponentDoubleClick(component, x, y) {
        if (this.isAddingComponent()) { return; }

        this.form.emit('component:event-auto-create', {
            componentName: component.name,
            eventName: component.getDefaultEventName()
        });
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
        this.form.emit('form:updated', this.formComponent.getSchema());
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

        let props = {
            left: Utils.snap(x, DesignerWindow.snapSize),
            top: Utils.snap(y, DesignerWindow.snapSize)
        };

        let events = {};

        if (this.copiedComponentSchema) {
            props = Object.assign({}, this.copiedComponentSchema.properties, props);
            events = this.copiedComponentSchema.events;
        }

        const component = this.form.createComponent(className, props, events);
        parentComponent.addChildren(component);

        component.onCreatedByDesigner(this);

        this.registerComponentEvents(component);
        this.rebuildComponent(parentComponent);
        this.finishComponentCreating();
        this.selectComponent(component);
    }

    startComponentCreating(className) {
        this.deselectComponent();
        this.selectedComponentClassToCreate = className;
        this.dom.$body.addClass('creating-component');
    }

    finishComponentCreating() {
        this.selectedComponentClassToCreate = null;
        this.dom.$body.removeClass('creating-component');
        this.form.emit('component:added');
    }

    copySelectedComponent() {
        if (!this.isComponentSelected()) { return; }
        if (this.isFormSelected()) { return; }

        this.copiedComponentSchema = this.selectedComponent.getSchema();
        delete this.copiedComponentSchema.properties.name;
    }

    pasteComponent() {
        if (!this.copiedComponentSchema) { return; }

        this.startComponentCreating(this.copiedComponentSchema.className);
    }

    duplicateSelectedComponent() {
        if (!this.isComponentSelected()) { return; }
        if (this.isFormSelected()) { return; }

        const parentComponent = this.selectedComponent.parent;
        const schema = this.selectedComponent.getSchema();

        const propertyValues = schema.properties;
        propertyValues.left = propertyValues.left + 20;
        propertyValues.top = propertyValues.top + 20;
        delete propertyValues.name;

        this.deselectComponent();
        const componentCopy = this.form.createComponent(schema.className, propertyValues, schema.events);

        parentComponent.addChildren(componentCopy);
        this.registerComponentEvents(componentCopy);
        this.rebuildComponent(parentComponent);
        this.selectComponent(componentCopy);
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