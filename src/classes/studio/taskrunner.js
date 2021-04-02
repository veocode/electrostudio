class TaskRunner {

    events = load.instance('classes/eventmanager');

    task;
    steps;

    runTask(taskName) {
        this.task = load.instance(`studio/tasks/${taskName}-task`, this);
        this.steps = this.task.getSteps();
        this.runNextTaskStep();
    }

    runNextTaskStep() {
        if (this.steps.length == 0) {
            this.events.emit('task:done');
            return;
        }

        const nextStepFunction = this.steps.shift();

        Promise.resolve(nextStepFunction.call(this.task)).then(() => {
            this.events.emit('task:step-done');
            this.runNextTaskStep();
        });
    }

    setStepTitle(title) {
        this.events.emit('task:step-title', title);
    }

    setProgressMode(mode = 'indeterminate') {
        this.events.emit('task:step-progress-mode', mode);
    }

    setProgressPercent(percent) {
        this.events.emit('task:step-progress', percent);
    }

}

module.exports = TaskRunner;