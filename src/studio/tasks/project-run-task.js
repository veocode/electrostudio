const Task = load.class('studio/task');

class ProjectRunTask extends Task {

    shellService;
    projectService;

    projectFolderPath;

    async boot() {
        this.shellService = this.getService('shell');
        this.projectService = this.getService('studio/project');
        this.projectFolderPath = await this.projectService.getFolder();
    }

    getSteps() {
        return [
            this.stepRunApplication,
        ];
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