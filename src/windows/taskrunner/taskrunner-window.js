const Window = load.class('window');

class TaskRunnerWindow extends Window {

    taskName;

    runner = load.instance('classes/studio/taskrunner');

    start() {
        const taskName = this.payload.taskName;

        this.runner.events.on('task:step-title', title => {
            this.labelStepTitle.label = title;
        })

        this.runner.events.on('task:done', () => {
            this.form.closeWindow();
        })

        this.runner.runTask(taskName);
    }

    onBtnCancelClick() {

    }

}

module.exports = TaskRunnerWindow;