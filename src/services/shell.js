const Service = load.class('service');
const child_process = load.node('child_process');

class ShellService extends Service {

    execute(caller, command, workingDirectoryPath) {
        return new Promise((resolve, reject) => {
            const parts = command.split(/\s+/g);
            const commandName = parts[0];
            const commandArgs = parts.slice(1);
            const options = { cwd: workingDirectoryPath };

            const process = child_process.spawn(commandName, commandArgs, options);

            // subprocess.stdout.on('data', (data) => {
            //     if (this.stdoutCallback) {
            //         this.stdoutCallback(data);
            //     }
            // });

            // subprocess.stderr.on('data', (data) => {
            //     if (this.stderrCallback) {
            //         this.stderrCallback(data);
            //     }
            // });

            process.on('error', error => {
                reject(new Error(t('Error executing command') + ': ' + error.message));
            });

            process.on('exit', code => {
                if (code == 0) {
                    resolve();
                    return;
                }
                reject(new Error(t('Error executing command') + ': ' + t('Non-zero return code')));
            });
        });
    }

}

module.exports = ShellService;