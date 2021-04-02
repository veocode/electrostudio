class Task {

    runner;

    constructor(runner) {
        this.runner = runner;
    }

    getSteps() {
        // Override in children
        return [];
    }

}

module.exports = Task;