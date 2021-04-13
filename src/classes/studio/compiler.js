const fs = load.node('fs');
const path = load.node('path');
const beautifier = load.node('js-beautify');
const Utils = load.class('utils');
const Presets = load.class('studio/presets');

class Compiler {

    initProject(folder) {
        let meta = Object.assign({}, Presets.DefaultMeta);
        let config = Object.assign({}, Presets.DefaultConfig);

        meta.name = config.appTitle = path.basename(folder);

        return new Promise(async (resolve, reject) => {
            try {
                await this.#createProjectStructure(folder);
                await this.#createPackageManifest(meta, folder);
                await this.#compileMeta(meta, folder);
                await this.#compileConfig(config, folder);
                await this.#createWindows(meta, folder);
                await this.#createControllers(meta, folder);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    compileProject(project) {
        const folder = project.folder;
        const meta = project.meta;
        return new Promise(async (resolve, reject) => {
            try {
                await this.#compileMeta(meta, folder);
                await this.#compileForms(meta, folder);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async #createProjectStructure(folder) {
        const rootDir = load.path();
        const targetDir = path.join(folder, 'src');
        const dirsCreated = [];

        for await (const entry of this.#walkDirectory(rootDir)) {
            const srcFilePath = entry;
            const relativeFilePath = entry.replace(rootDir + path.sep, '');
            const destFilePath = path.join(targetDir, relativeFilePath);
            const destDirPath = path.dirname(destFilePath);

            if (destDirPath && !dirsCreated.includes(destDirPath)) {
                await fs.promises.mkdir(destDirPath, { recursive: true });
                dirsCreated.push(destDirPath);
            }

            await fs.promises.copyFile(srcFilePath, destFilePath);
        }
    }

    async #createPackageManifest(meta, folder) {
        const manifest = Presets.PackageManifest;
        manifest.name = meta.name;
        manifest.version = meta.version;
        manifest.author = meta.author;
        manifest.description = meta.description;

        const manifestJSON = JSON.stringify(manifest, null, 4);
        const manifestFilePath = path.join(folder, Presets.FileNames.Manifest);
        await load.write(manifestFilePath, manifestJSON);
    }

    async #compileMeta(meta, folder) {
        const metaDir = path.join(folder, 'meta');
        await fs.promises.mkdir(metaDir, { recursive: true });

        const metaJSON = JSON.stringify(meta, null, 2);
        const metaFilePath = path.join(metaDir, Presets.FileNames.Meta);
        await load.write(metaFilePath, metaJSON);
    }

    async #compileConfig(config, folder) {
        const configJSON = JSON.stringify(config, null, 4);
        const configContent = `module.exports = ${configJSON}`;
        const configFilePath = path.join(folder, 'src', Presets.FileNames.Config);
        await load.write(configFilePath, configContent);
    }

    async #createWindows(meta, folder) {
        for (let [formName, formMeta] of Object.entries(meta.forms)) {
            await this.#createWindow(formName, folder);
            await this.#compileForm(formName, formMeta, folder);
        }
    }

    async #createWindow(name, folder) {
        const windowDir = path.join(folder, 'src', 'windows', name);
        await fs.promises.mkdir(windowDir, { recursive: true });

        const windowFilePath = path.join(windowDir, `${name}-window.js`);

        const windowClassName = Utils.nameToClassName(name, 'Window');

        const windowTemplate = await this.#getTemplateContents('window.js');
        const windowCode = beautifier.js(Utils.renderTemplate(windowTemplate, {
            className: windowClassName,
        }));

        await load.write(windowFilePath, windowCode);
    }

    async #compileForms(meta, folder) {
        for (let [formName, formMeta] of Object.entries(meta.forms)) {
            await this.#compileForm(formName, formMeta, folder);
        }
    }

    async #compileForm(name, formMeta, folder) {
        const windowDir = path.join(folder, 'src', 'windows', name);
        await fs.promises.mkdir(windowDir, { recursive: true });

        const formFilePath = path.join(windowDir, `${name}-form.js`);
        const formClassName = Utils.nameToClassName(name, 'Form');

        const formTemplate = await this.#getTemplateContents('form.js');
        const formCode = beautifier.js(Utils.renderTemplate(formTemplate, {
            className: formClassName,
            formProperties: formMeta.schema,
            formChildren: formMeta.components || [],
        }));

        await load.write(formFilePath, formCode);
    }

    async #createControllers(meta, folder) {
        this.#createController('main', meta, folder);
    }

    async #createController(name, meta, folder) {
        const controllerDir = path.join(folder, 'src', 'controllers', name);
        await fs.promises.mkdir(controllerDir, { recursive: true });

        const controllerFilePath = path.join(controllerDir, `${name}-controller.js`);
        const controllerClassName = Utils.nameToClassName(name, 'Controller');

        const controllerTemplate = await this.#getTemplateContents('controller.js');
        const controllerCode = beautifier.js(Utils.renderTemplate(controllerTemplate, {
            className: controllerClassName,
            defaultFormName: meta.defaultFormName
        }));

        await load.write(controllerFilePath, controllerCode);
    }

    async #getTemplateContents(name) {
        const templateDir = load.path('studio', 'templates');
        const templateFile = path.join(templateDir, `${name}.template`);
        return await load.read(templateFile);
    }

    async *#walkDirectory(directory) {
        for await (const nextFile of await fs.promises.opendir(directory)) {
            const filePath = path.join(directory, nextFile.name);
            if (nextFile.isDirectory()) {
                const ignoreFilePath = path.join(directory, nextFile.name, Presets.FileNames.Ignore);
                if (!fs.existsSync(ignoreFilePath)) {
                    yield* await this.#walkDirectory(filePath);
                }
            } else {
                if (nextFile.isFile()) yield filePath;
            }
        }
    }

}

module.exports = Compiler;