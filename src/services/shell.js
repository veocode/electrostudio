const Service = load.class('service');
const child_process = load.node('child_process');

class ShellService extends Service {

    execute(caller, command, workingDirectoryPath) {
        return new Promise((resolve, reject) => {

            const options = { cwd: workingDirectoryPath };

            child_process.exec(command, options, (error) => {
                if (error) {
                    reject(t('Error executing command') + ': ' + error.message);
                    return;
                }
                resolve();
            });

        });
    }

}

module.exports = ShellService;