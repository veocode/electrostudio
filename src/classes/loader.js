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
        for (i = 1; i < arguments.length; i++) {
            const name = arguments[i];
            result[name] = full[name];
        }
        return result;
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

    instance(name, ...constructorArgs) {
        return new (this.class(name))(...constructorArgs);
    }

    singleton(name, ...constructorArgs) {
        if (name in this.#singletons) {
            return this.#singletons[name];
        }
        return this.#singletons[name] = this.instance(name, ...constructorArgs);
    }

    controller(name) {
        return new (this.file(`controllers/${name}/${name}-controller`))();
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

    config() {
        return this.file('config');
    }

    read(file) {
        const filePath = `${Loader.rootDir}/${file}`;
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
