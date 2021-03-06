class Controller {

    form = null;

    boot() {
        // Override in children
    }

    start() {
        // Override in children
    }

    async run() {
        this.boot();
        if (this.form) {
            await this.form.createWindow();
        }
        this.start();
    }

}

module.exports = Controller;
