const Compiler = load.class('studio/compiler');

class Project {

    folder;
    meta = {};

    #isFolderSelected = true;
    #isDirty = false;

    #compiler = new Compiler(this);

    constructor(folder = null) {
        if (folder == null || !this.isFolderContainsProject(folder)) {
            folder = load.path('studio', 'default-project');
            this.#isFolderSelected = false;
        }
        this.folder = folder;
    }

    async load() {
        return new Promise(async resolve => {
            const metaJSON = await load.read(`${this.folder}/meta/${Compiler.FileNames.Meta}`);
            this.meta = JSON.parse(metaJSON);
            resolve();
        })
    }

    save() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.#compiler.compileProject();
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

    isFolderSelected() {
        return this.#isFolderSelected;
    }

    isFolderContainsProject(folder) {
        const path = load.node('path');
        const fs = load.node('fs');
        return fs.existsSync(path.join(folder, 'meta', Compiler.FileNames.Meta));
    }

    setFolder(folder) {
        const path = load.node('path');
        this.folder = folder;
        this.meta.name = path.basename(folder);
        this.#isFolderSelected = true;
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
        const formName = schema.properties.name;
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