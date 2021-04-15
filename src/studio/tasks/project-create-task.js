const Task = load.class('studio/task');

class ProjectRunTask extends Task {

    shellService;
    compilerService;

    projectFolderPath;

    async boot(folder) {
        this.shellService = this.getService('shell');
        this.compilerService = this.getService('studio/compiler');
        this.projectService = this.getService('studio/project');
        this.projectFolderPath = folder;
    }

    getSteps() {
        return [
            this.stepVerifyNPM,
            this.stepInitProject,
            this.stepInstallDependencies
        ];
    }

    stepVerifyNPM(resolve, reject) {
        const stepTitle = t('Verifying NPM installation');
        const stepError = t('NPM is not found on your machine.\nPlease install NPM and Node.js to build the project.');

        this.runner.setStepTitle(`${stepTitle}...`);

        this.shellService.execute('npm -v').then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

    stepInitProject(resolve, reject) {
        const stepTitle = t('Creating Project Structure');
        const stepError = t('Failed to create project structure, check folder permissions.');

        this.runner.setStepTitle(`${stepTitle}...`);

        this.compilerService.initProject(this.projectFolderPath).then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

    stepInstallDependencies(resolve, reject) {
        const stepTitle = t('Installing dependencies');
        const stepError = t('Failed to execute npm install command in project folder');

        this.runner.setStepTitle(`${stepTitle}...`);

        this.shellService.execute('npm install', this.projectFolderPath).then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

}

module.exports = ProjectRunTask;