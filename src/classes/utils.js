const path = load.node('path');
const fs = load.node('fs');

class Utils {

    static snap(value, snapSize = 10) {
        return Math.round(value / snapSize) * snapSize
    }

    static percent(value, maxValue, minValue = 0) {
        return ((value - minValue) * 100) / (maxValue - minValue);
    }

    static async *walkDirectory(directory) {
        for await (const nextFile of await fs.promises.opendir(directory)) {
            const entry = path.join(directory, nextFile.name);
            if (nextFile.isDirectory()) yield* await Utils.walkDirectory(entry);
            else if (nextFile.isFile()) yield entry;
        }
    }

    static renderTemplate(template, context = {}) {
        let tokens = template.matchAll(/{%([a-zA-Z0-9\s_]+)%}/g);
        if (tokens) {
            for (let token of tokens) {
                const originalTag = token[0].trim();
                const variableName = token[1].trim();

                let variableValue = (variableName in context) ? context[variableName] : '';
                if (typeof (variableValue) == 'object') {
                    variableValue = JSON.stringify(variableValue);
                }

                template = template.replace(originalTag, variableValue);
            }
        }
        return template;
    }

    static nameToClassName(name, suffix = '') {
        let nameParts = name.split(/_|-/);
        let className = nameParts.map(part => Utils.capitalizeFirstLetter(part)).join('');
        if (suffix && !className.includes(suffix)) {
            className += suffix;
        }
        return className;
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}

module.exports = Utils;