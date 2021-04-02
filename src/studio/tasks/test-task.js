const Task = load.class('studio/task');

class TestTask extends Task {

    getSteps() {
        return [
            this.step1,
            this.step2,
            this.step3,
            this.step4
        ];
    }

    step1() {
        return new Promise((resolve, reject) => {

            this.runner.setStepTitle('Bulding project');
            setTimeout(() => resolve(), 2000);

        });
    }

    step2() {
        return new Promise((resolve, reject) => {

            this.runner.setStepTitle('Compiling project');
            setTimeout(() => resolve(), 2000);

        });
    }

    step3() {
        return new Promise((resolve, reject) => {

            this.runner.setStepTitle('Doing something with compiled project');
            setTimeout(() => resolve(), 2000);

        });
    }

    step4() {
        return new Promise((resolve, reject) => {

            this.runner.setStepTitle('Finishing installation');
            setTimeout(() => resolve(), 2000);

        });
    }

}

module.exports = TestTask;