class TaskRunner {

    events = load.instance('classes/eventmanager');

    window;
    task;
    steps = [];

    constructor(window) {
        this.window = window;
    }

    setTask(taskName) {
        this.task = load.instance(`studio/tasks/${taskName}-task`, this);
    }

    getStepsCount() {
        return this.steps.length;
    }

    start() {
        this.steps = this.task.getSteps();
        this.runNextTaskStep();
    }

    runNextTaskStep() {
        if (this.steps.length == 0) {
            this.events.emit('task:done');
            return;
        }

        const nextStepFunction = this.steps.shift();
        const nextStepPromise = new Promise((resolve, reject) => nextStepFunction.call(this.task, resolve, reject));

        Promise.resolve(nextStepPromise).then(() => {
            this.events.emit('task:step-done');
            this.runNextTaskStep();
        }, (errorMessage) => {
            this.fail(errorMessage);
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

    fail(reasonMessage) {
        this.events.emit('task:step-failed', reasonMessage);
    }

}

module.exports = TaskRunner;