const Window = load.class('window');

class SplashWindow extends Window {

    selectedProjectFolder;

    dialogService = this.getService('dialogs');
    studioService = this.getService('studio/studio');

    taskRunnerForm = load.form('taskrunner');

    start() {
        this.initTaskRunner();
        this.initLastProjectButton();
    }

    initTaskRunner() {
        this.taskRunnerForm.on('closed', () => {
            if (!this.selectedProjectFolder) {
                this.show();
            }
        });

        this.taskRunnerForm.on('task:done', payload => {
            if (payload.taskName == 'project-create') {
                const folder = payload.taskArgs[0];
                this.onProjectSelected(folder);
            }
        });
    }

    async initLastProjectButton() {
        const lastProjectFolder = settings.get('lastProjectFolder', null);
        if (!lastProjectFolder) { return; }

        const isValid = await this.studioService.isFolderContainsProject(lastProjectFolder);
        if (!isValid) { return; }

        this.btnLastProject.enabled = true;
    }

    async onBtnNewProjectClick() {
        const folder = await this.getNewProjectFolderPath();
        if (folder == null) { return; }

        const isSuitable = await this.studioService.isFolderSuitableForNewProject(folder);
        if (!isSuitable) {
            this.dialogService.showErrorDialog(t('Selected folder is not empty'));
            return;
        }

        this.hide();
        this.taskRunnerForm.createWindow({
            taskName: 'project-create',
            taskArgs: [folder]
        });
    }

    async onBtnLastProjectClick() {
        const lastProjectFolder = settings.get('lastProjectFolder');
        this.onProjectSelected(lastProjectFolder);
    }

    async onBtnOpenProjectClick() {
        const folder = await this.getOpenProjectFolderPath();
        if (folder == null) { return; }

        const isValid = await this.studioService.isFolderContainsProject(folder);
        if (!isValid) {
            this.dialogService.showErrorDialog(t('Selected folder does not contain ElectroStudio Project'));
            return;
        }

        this.onProjectSelected(folder);
    }

    onBtnCloseClick() {
        this.close();
    }

    async onProjectSelected(folder) {
        this.hide();
        this.selectedProjectFolder = folder;
        try {
            await this.studioService.loadProject(folder);
            await load.form('main').createWindow();
            settings.set('lastProjectFolder', folder);
            this.close();
        } catch (error) {
            this.dialogService.showErrorDialog(error);
        }
    }

    async getNewProjectFolderPath() {
        const result = await this.dialogService.showOpenDialog({
            title: t('Select New Project Folder'),
            properties: ['openDirectory']
        });

        if (result.canceled || !result.filePaths[0]) {
            return null;
        }

        return result.filePaths[0];
    }

    async getOpenProjectFolderPath() {
        const result = await this.dialogService.showOpenDialog({
            title: t('Select Project Folder'),
            properties: ['openDirectory']
        });

        if (result.canceled || !result.filePaths[0]) {
            return null;
        }

        return result.filePaths[0];
    }

}

module.exports = SplashWindow;