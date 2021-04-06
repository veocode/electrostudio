const Compiler = load.class('studio/compiler');
const path = load.node('path');
const fs = load.node('fs');

class Project {

    folder;
    meta = {};

    #isFolderSelected = true;
    #isDirty = false;

    #compiler = new Compiler(this);

    constructor(folder = null) {
        let isUseDefaultFolder = false;

        if (folder == null || !this.isFolderContainsProject(folder)) {
            folder = load.path('studio', 'default-project');
            isUseDefaultFolder = true;
        }

        this.setFolder(folder);

        if (isUseDefaultFolder) {
            this.#isFolderSelected = false;
        }
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
                this.setDirty(false);
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

    isFolderSelected() {
        return this.#isFolderSelected;
    }

    isFolderPackageCompiled() {
        return fs.existsSync(path.join(this.folder, 'node_modules'));
    }

    isFolderContainsProject(folder) {
        return fs.existsSync(path.join(folder, 'meta', Compiler.FileNames.Meta));
    }

    getFolder() {
        return this.folder;
    }

    setFolder(folder) {
        this.folder = folder;
        this.meta.name = path.basename(folder);
        this.#isFolderSelected = true;
    }

    isDirty() {
        return this.#isDirty;
    }

    setDirty(isDirty) {
        this.#isDirty = isDirty;
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

        this.setDirty(true);
    }

}

module.exports = Project;