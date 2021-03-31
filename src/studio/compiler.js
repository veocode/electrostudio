const fs = load.node('fs');
const path = load.node('path');

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
            'electron-unhandled': '^3.0.2',
            'interactjs': '^1.10.8'
        }
    };

    static DefaultConfig = {
        appTitle: '',
        mainControllerName: 'main',
        baseWindowPreloadScript: 'windows/base/base-preload.js',
        baseWindowView: 'windows/base/base-window.html',
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
                resolve();
            } catch (err) {
                reject(err);
            }
        });

    }

    async createProjectStructure() {
        const rootDir = load.path();
        const targetDir = `${this.project.folder}/src`;

        for await (const entry of this.walkDirectory(rootDir)) {
            const srcFilePath = entry;
            const relativeFilePath = entry.replace(`${rootDir}/`, '');
            const destFilePath = path.join(targetDir, relativeFilePath);
            const destDirPath = path.dirname(destFilePath);

            if (destDirPath) {
                await fs.promises.mkdir(destDirPath, { recursive: true });
            }

            await fs.promises.copyFile(srcFilePath, destFilePath);
        }
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

    async compileMeta() {
        const metaJSON = JSON.stringify(this.project.meta, null, 4);
        const metaFilePath = path.join(this.project.folder, Compiler.FileNames.Meta);
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

}

module.exports = Compiler;