const fs = require('fs');
const path = require('path');

class Loader {

    static rootDir = path.resolve(__dirname, '..');

    #singletons = {};

    constructor() {
        let self = this;
    }

    node(module) {
        if (arguments.length == 1) {
            return require(module);
        }
        if (arguments.length == 2) {
            return require(module)[arguments[1]];
        }
        const full = require(module);
        let result = {};
        for (let i = 1; i < arguments.length; i++) {
            const name = arguments[i];
            result[name] = full[name];
        }
        console.log('result', result);
        return result;
    }

    electron(apiName) {
        return this.node('electron', apiName);
    }

    path(file) {
        return `${Loader.rootDir}/${file}`;
    }

    file(name) {
        return require(`${Loader.rootDir}/${name}`);
    }

    class(name) {
        return this.file(`classes/${name}`);
    }

    studio(name) {
        return this.file(`studio/${name}`);
    }

    instance(name, ...constructorArgs) {
        return new (this.file(name))(...constructorArgs);
    }

    singleton(name, ...constructorArgs) {
        if (name in this.#singletons) {
            return this.#singletons[name];
        }
        return this.#singletons[name] = this.instance(name, ...constructorArgs);
    }

    controller(name, ...constructorArgs) {
        return this.instance(`controllers/${name}/${name}-controller`, ...constructorArgs);
    }

    form(name, ...constructorArgs) {
        return this.instance(`windows/${name}/${name}-form`, ...constructorArgs);
    }

    window(name, options) {
        return this.instance(`windows/${name}/${name}-window`, name, options);
    }

    service(name) {
        return this.instance(`services/${name}`, name);
    }

    model(file) {
        return this.file(`models/${file}`);
    }

    models = new Proxy(this, {
        get(target, dir) {
            return () => {
                const dirPath = `${Loader.rootDir}/models/${dir}`;
                let result = {};
                fs.readdirSync(dirPath).forEach(file => {
                    result = Object.assign({}, result, load.model(`${dir}/${file.replace('.js', '')}`));
                });
                return result;
            }
        },
    });

    componentClasses() {
        const dirPath = `${Loader.rootDir}/models/components`;
        let classesDictionary = {};
        fs.readdirSync(dirPath).forEach(file => {
            const model = load.model(`components/${file.replace('.js', '')}`);
            classesDictionary = Object.assign({}, classesDictionary, model.classes);
        });
        return classesDictionary;
    }

    config() {
        return this.file('config');
    }

    read(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', function (err, contents) {
                if (err) {
                    reject(err);
                } else {
                    resolve(contents);
                }
            });
        });
    }

}

module.exports = Loader;
