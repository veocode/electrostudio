class Controller {

    form = null;

    boot() {
        // Override in children
    }

    start() {
        // Override in children
    }

    run() {
        this.boot();
        if (this.form) {
            this.form.createWindow();
        }
        this.start();
    }

}

module.exports = Controller;
