class Project {

    folder;
    meta = {};

    constructor(folder = null) {
        if (folder == null) {
            folder = load.path('studio/default-project');
        }
        this.folder = folder;
    }

    async load() {
        return new Promise(async resolve => {
            const metaJSON = await load.read(`${this.folder}/es.project.json`);
            this.meta = JSON.parse(metaJSON);
            resolve();
        })
    }

    getFormSchema(formName) {
        return this.meta.forms[formName].schema;
    }

    getFormChildren(formName) {
        return this.meta.forms[formName].children;
    }

    getActiveFormName() {
        return this.meta.activeFormName;
    }

    getActiveFormSchema() {
        return this.getFormSchema(this.getActiveFormName());
    }

    getDefaultFormName() {
        return this.meta.defaultFormName;
    }

    getDefaultFormSchema() {
        return this.getFormSchema(this.getDefaultFormName());
    }

}

module.exports = Project;