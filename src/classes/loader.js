const fs = require('fs');
const path = require('path');

class Loader {

    rootDir;

    constructor(rootDir) {
        this.rootDir = rootDir;
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

}

module.exports = Loader;
