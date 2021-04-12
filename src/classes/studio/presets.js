module.exports = {

    FileNames: {
        Ignore: '.esignore',
        Meta: 'es.project.json',
        Manifest: 'package.json',
        Config: 'config.js'
    },

    PackageManifest: {
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
    },

    DefaultConfig: {
        appTitle: '',
        mainControllerName: 'main',
        baseWindowPreloadScript: ['windows', 'base', 'base-preload.js'],
        baseWindowView: ['windows', 'base', 'base-window.html'],
    },

    DefaultMeta: {
        name: "Untitled Project",
        version: "1.0.0",
        description: "My Electron Application",
        author: "Unknown Author",
        license: "0BSD",
        activeFormName: "main",
        defaultFormName: "main",
        forms: {
            main: {
                schema: {
                    name: "main",
                    title: "My Electron App",
                    left: 400,
                    top: 100,
                    width: 640,
                    height: 480,
                    resizable: true,
                    maximizable: true,
                    minimizable: true
                },
                components: []
            }
        }
    }

}