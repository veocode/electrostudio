const Task = load.class('studio/task');

class ProjectRunTask extends Task {

    shellService;
    projectService;

    projectFolderPath;
    isProjectPackageCompiled;

    async boot() {
        this.shellService = this.getService('shell');
        this.projectService = this.getService('studio/project');
        this.projectFolderPath = await this.projectService.getFolder();
        this.isProjectPackageCompiled = await this.projectService.isFolderPackageCompiled();
    }

    getSteps() {
        if (this.isProjectPackageCompiled) {
            return [
                this.stepRunApplication,
            ];
        }

        return [
            this.stepVerifyNPM,
            this.stepInstallDependencies,
            this.stepRunApplication,
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

    async stepInstallDependencies(resolve, reject) {
        const stepTitle = t('Installing dependencies');
        const stepError = t('Failed to execute npm install command in project folder');

        this.runner.setStepTitle(`${stepTitle}...`);

        this.shellService.execute('npm install', this.projectFolderPath).then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

    stepRunApplication(resolve, reject) {
        const stepTitle = t('Running Application');
        const stepError = t('Failed to execute npm start command in project folder');

        this.runner.setStepTitle(`${stepTitle}...`);

        this.shellService.execute('npm start', this.projectFolderPath).then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

}

module.exports = ProjectRunTask;