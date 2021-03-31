const path = load.node('path');
const fs = load.node('fs');

class Utils {

    static snap(value, snapSize = 10) {
        return Math.round(value / snapSize) * snapSize
    }

    static async *walkDirectory(directory) {
        for await (const nextFile of await fs.promises.opendir(directory)) {
            const entry = path.join(directory, nextFile.name);
            if (nextFile.isDirectory()) yield* await Utils.walkDirectory(entry);
            else if (nextFile.isFile()) yield entry;
        }
    }

}

module.exports = Utils;