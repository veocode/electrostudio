const path = load.node('path');
const fs = load.node('fs');
const Utils = load.class('utils');
const Presets = load.class('studio/presets');


class Project {

    folder;
    meta = {};

    #isDirty = false;

    getName() {
        return this.meta.name;
    }

    getFolder() {
        return this.folder;
    }

    setFolder(folder) {
        this.folder = folder;
    }

    async isFolderSuitableForNewProject(folder) {
        return await Utils.isFolderEmpty(folder);
    }

    async isFolderContainsProject(folder) {
        return await Utils.isPathExists(path.join(folder, 'meta', Presets.FileNames.Meta));
    }

    async load() {
        return new Promise(async (resolve, reject) => {
            try {
                const metaJSON = await load.read(`${this.folder}/meta/${Presets.FileNames.Meta}`);
                this.meta = JSON.parse(metaJSON);
                this.setDirty(false);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    save() {
        return new Promise(async (resolve, reject) => {
            try {
                this.setDirty(false);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    isDirty() {
        return this.#isDirty;
    }

    setDirty(isDirty) {
        this.#isDirty = isDirty;
    }

    getFormWindowFilePath(formName) {
        return path.join(this.folder, 'src', 'windows', formName, `${formName}-window.js`);
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

    getActiveFormWindowFilePath() {
        return this.getFormWindowFilePath(this.getActiveFormName());
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

    updateActiveForm(schema) {
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

        this.meta.forms[formName].schema = schema.properties;
        this.meta.forms[formName].components = schema.children;

        this.setDirty(true);
    }

}

module.exports = Project;