const Window = load.class('window');

class SplashWindow extends Window {

    dialogService = this.getService('dialogs');

    taskRunnerForm = load.form('taskrunner');

    start() {
        this.initTaskRunner();
    }

    initTaskRunner() {
        this.taskRunnerForm.on('closed', () => {
            this.show();
        })
    }

    async onBtnNewProjectClick() {
        const folder = await this.getNewProjectFolderPath();
        if (folder == null) { return; }

        this.hide();
        this.taskRunnerForm.createWindow({
            taskName: 'project-create',
            taskArgs: [folder]
        });
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

    onBtnLastProjectClick() {

    }

    onBtnOpenProjectClick() {

    }

    onBtnCloseClick() {
        this.close();
    }

}

module.exports = SplashWindow;