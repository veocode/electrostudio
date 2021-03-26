class Project {

    static MetaFileName = 'es.project.json';

    folder;
    meta = {};

    #isFolderSelected = true;
    #isDirty = false;

    constructor(folder = null) {
        if (folder == null) {
            folder = load.path('studio/default-project');
            this.#isFolderSelected = false;
        }
        this.folder = folder;
    }

    async load() {
        return new Promise(async resolve => {
            const metaJSON = await load.read(`${this.folder}/${Project.MetaFileName}`);
            this.meta = JSON.parse(metaJSON);
            resolve();
        })
    }

    isFolderSelected() {
        return this.#isFolderSelected;
    }

    getFormSchema(formName) {
        return this.meta.forms[formName].schema;
    }

    getFormComponents(formName) {
        return this.meta.forms[formName].components;
    }

    getActiveFormName() {
        return this.meta.activeFormName;
    }

    getActiveFormSchema() {
        return this.getFormSchema(this.getActiveFormName());
    }

    getActiveFormComponents() {
        return this.getFormComponents(this.getActiveFormName());
    }

    getDefaultFormName() {
        return this.meta.defaultFormName;
    }

    getDefaultFormSchema() {
        return this.getFormSchema(this.getDefaultFormName());
    }

    isDefaultFormActive() {
        return this.getDefaultFormName() == this.getActiveFormName();
    }

    updateActiveForm(schema, componentSchemas) {
        const currentFormName = this.getActiveFormName();
        const formName = schema.name;
        const isDefaultForm = this.isDefaultFormActive();

        // Handle Form renaming here
        if (formName != currentFormName) {
            delete this.meta.forms[currentFormName];
            this.meta.activeFormName = formName;
            if (isDefaultForm) {
                this.meta.defaultFormName = formName;
            }
        }

        if (!(formName in this.meta.forms)) {
            this.meta.forms[formName] = {
                schema: {},
                components: {}
            }
        }

        this.meta.forms[formName].schema = schema;
        this.meta.forms[formName].components = componentSchemas;

        this.#isDirty = true;
    }

}

module.exports = Project;