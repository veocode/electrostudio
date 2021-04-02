const Window = load.class('window');

class TaskRunnerWindow extends Window {

    start() {
        this.labelStepTitle.label = `RUN: ${this.payload.taskName}`;
    }

}

module.exports = TaskRunnerWindow;