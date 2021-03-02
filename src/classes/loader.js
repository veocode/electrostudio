const fs = require('fs');
const path = require('path');

class Loader {

    rootDir;

    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
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
        return `${this.rootDir}/${file}`;
    }

    file(name) {
        return require(`${this.rootDir}/${name}`);
    }

    class(name) {
        return this.file(`classes/${name}`);
    }

    instance(name) {
        return new (this.class(name))();
    }

    controller(name) {
        return new (this.file(`controllers/${name}/${name}-controller`))();
    }

    model(file) {
        return this.file(`models/${file}`);
    }

    config() {
        return this.file('config');
    }

    read(file) {
        const filePath = `${this.rootDir}/${file}`;
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

    components() {
        const componentsPath = `${this.rootDir}/models/components`;
        let components = {};
        fs.readdirSync(componentsPath).forEach(file => {
            components = Object.assign({}, components, this.model(`components/${file.replace('.js', '')}`));
        });
        return components;
    }

}

module.exports = Loader;
