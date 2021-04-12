const Window = load.class('window');

class TaskRunnerWindow extends Window {

    taskName;

    runner = load.instance('classes/studio/taskrunner', this);

    start() {
        const taskName = this.payload.taskName;
        const taskArgs = this.payload.taskArgs ?? [];

        this.runner.events.on('task:step-title', title => {
            this.labelStepTitle.label = title;
        })

        this.runner.events.on('task:step-failed', async (message) => {
            await this.getService('dialogs').showErrorDialog(message);
            this.close();
        })

        this.runner.events.on('task:done', () => {
            this.form.emit('task:done', this.payload);
            this.close();
        })

        this.runner.setTask(taskName);
        this.runner.start(...taskArgs);
    }

    onBtnCancelClick() {

    }

}

module.exports = TaskRunnerWindow;