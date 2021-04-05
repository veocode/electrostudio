class Task {

    runner;

    constructor(runner) {
        this.runner = runner;
        this.boot();
    }

    boot() {
        // Override in children
    }

    getSteps() {
        // Override in children
        return [];
    }

    getService(serviceName) {
        return this.runner.window.getService(serviceName);
    }

}

module.exports = Task;