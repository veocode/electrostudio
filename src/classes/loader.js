const fs = require('fs');
const path = require('path');

class Loader {

    static rootDir = path.resolve(__dirname, '..');

    #singletons = {};

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
        return result;
    }

    electron(apiName) {
        return this.node('electron', apiName);
    }

    path(...files) {
        if (!files.length) {
            return Loader.rootDir;
        }
        if (files.length == 1 && Array.isArray(files[0])) {
            files = files[0];
        }
        return path.join(Loader.rootDir, ...files);
    }

    file(name) {
        return require(`${Loader.rootDir}/${name}`);
    }

    class(name) {
        return this.file(`classes/${name}`);
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

    write(filePath, contents) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, contents, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

}

module.exports = Loader;
