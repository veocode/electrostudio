class Controller {

    window = null;

    boot() {
        // Override in children
    }

    start() {
        // Override in children
    }

    run() {
        this.boot();
        if (this.window) {
            this.window.show();
        }
        this.start();
    }

}

module.exports = Controller;
