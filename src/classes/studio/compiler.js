const fs = load.node('fs');
const path = load.node('path');
const Utils = load.class('utils');
const beautifier = load.node('js-beautify');

class Compiler {

    static FileNames = {
        Ignore: '.esignore',
        Meta: 'es.project.json',
        Manifest: 'package.json',
        Config: 'config.js'
    };

    static PackageManifest = {
        name: '',
        version: '1.0.0',
        description: '',
        main: 'src/main.js',
        scripts: {
            'start': 'electron .',
            'pack': 'electron-builder --dir',
            'dist': 'electron-builder'
        },
        keywords: [],
        author: '',
        license: 'ISC',
        devDependencies: {
            'electron': '^11.3.0',
            'electron-builder': '^22.9.1'
        },
        dependencies: {
            'electron-store': '^7.0.2',
            'electron-unhandled': '^3.0.2',
            'interactjs': '^1.10.8'
        }
    };

    static DefaultConfig = {
        appTitle: '',
        mainControllerName: 'main',
        baseWindowPreloadScript: ['windows', 'base', 'base-preload.js'],
        baseWindowView: ['windows', 'base', 'base-window.html'],
    };

    project;

    constructor(project) {
        this.project = project;
    }

    compileProject() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.createProjectStructure();
                await this.compilePackageManifest();
                await this.compileMeta();
                await this.compileConfig();
                await this.compileWindows();
                await this.compileControllers();
                resolve();
            } catch (err) {
                reject(err);
            }
        });

    }

    async createProjectStructure() {
        const rootDir = load.path();
        const targetDir = path.join(this.project.folder, 'src');
        const dirsCreated = [];

        for await (const entry of this.walkDirectory(rootDir)) {
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

    async compileMeta() {
        const metaDir = path.join(this.project.folder, 'meta');
        await fs.promises.mkdir(metaDir, { recursive: true });

        const metaJSON = JSON.stringify(this.project.meta, null, 2);
        const metaFilePath = path.join(metaDir, Compiler.FileNames.Meta);
        await load.write(metaFilePath, metaJSON);
    }

    async compilePackageManifest() {
        const manifest = Compiler.PackageManifest;
        manifest.name = this.project.meta.name;
        manifest.version = this.project.meta.version;
        manifest.author = this.project.meta.author;
        manifest.description = this.project.meta.description;

        const manifestJSON = JSON.stringify(manifest, null, 4);
        const manifestFilePath = path.join(this.project.folder, Compiler.FileNames.Manifest);
        await load.write(manifestFilePath, manifestJSON);
    }

    async compileConfig() {
        const config = Compiler.DefaultConfig;
        config.appTitle = this.project.meta.name;

        const configJSON = JSON.stringify(config, null, 4);
        const configContent = `module.exports = ${configJSON}`;
        const configFilePath = path.join(this.project.folder, 'src', Compiler.FileNames.Config);
        await load.write(configFilePath, configContent);
    }

    async compileWindows() {
        for (let [formName, meta] of Object.entries(this.project.meta.forms)) {
            await this.compileWindow(formName, meta.schema);
        }
    }

    async compileWindow(name, schema) {
        const windowDir = path.join(this.project.folder, 'src', 'windows', name);
        await fs.promises.mkdir(windowDir, { recursive: true });

        const formFilePath = path.join(windowDir, `${name}-form.js`);
        const windowFilePath = path.join(windowDir, `${name}-window.js`);

        const formClassName = Utils.nameToClassName(name, 'Form');
        const windowClassName = Utils.nameToClassName(name, 'Window');

        const formTemplate = await this.getTemplateContents('form.js');
        const formCode = beautifier.js(Utils.renderTemplate(formTemplate, {
            className: formClassName,
            formProperties: schema.properties,
            formChildren: schema.children
        }));

        const windowTemplate = await this.getTemplateContents('window.js');
        const windowCode = beautifier.js(Utils.renderTemplate(windowTemplate, {
            className: windowClassName,
        }));

        await load.write(formFilePath, formCode);
        await load.write(windowFilePath, windowCode);
    }

    async compileControllers() {
        this.compileController('main');
    }

    async compileController(name) {
        const controllerDir = path.join(this.project.folder, 'src', 'controllers', name);
        await fs.promises.mkdir(controllerDir, { recursive: true });

        const controllerFilePath = path.join(controllerDir, `${name}-controller.js`);
        const controllerClassName = Utils.nameToClassName(name, 'Controller');

        const controllerTemplate = await this.getTemplateContents('controller.js');
        const controllerCode = beautifier.js(Utils.renderTemplate(controllerTemplate, {
            className: controllerClassName,
            defaultFormName: this.project.meta.defaultFormName
        }));

        await load.write(controllerFilePath, controllerCode);
    }

    async getTemplateContents(name) {
        const templateDir = load.path('studio', 'templates');
        const templateFile = path.join(templateDir, `${name}.template`);
        return await load.read(templateFile);
    }

    async *walkDirectory(directory) {
        for await (const nextFile of await fs.promises.opendir(directory)) {
            const filePath = path.join(directory, nextFile.name);
            if (nextFile.isDirectory()) {
                const ignoreFilePath = path.join(directory, nextFile.name, Compiler.FileNames.Ignore);
                if (!fs.existsSync(ignoreFilePath)) {
                    yield* await this.walkDirectory(filePath);
                }
            } else {
                if (nextFile.isFile()) yield filePath;
            }
        }
    }

}

module.exports = Compiler;