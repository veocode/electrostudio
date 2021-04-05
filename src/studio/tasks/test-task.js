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

    step1(resolve, reject) {
        const stepTitle = t('Verifying NPM installation');
        const stepError = t('NPM is not found on your machine.\nPlease install NPM and Node.js to build the project.');

        this.runner.setStepTitle(`${stepTitle}...`);

        const shellService = this.getService('shell')

        shellService.execute('ngm -v').then(
            () => { resolve(); },
            () => { reject(stepError); }
        )
    }

    step2(resolve, reject) {
        this.runner.setStepTitle('Compiling project');
        setTimeout(() => resolve('Failed to compile project'), 2000);
    }

    step3(resolve, reject) {
        this.runner.setStepTitle('Doing something with compiled project');
        setTimeout(() => resolve(), 2000);
    }

    step4(resolve, reject) {
        this.runner.setStepTitle('Finishing installation');
        setTimeout(() => resolve(), 2000);
    }

}

module.exports = TestTask;