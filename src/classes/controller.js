class Controller {

    window = null;

    constructor() {

    }

    boot() { }
    start() { }

    run() {
        this.boot();
        if (this.window) {
            this.window.show();
        }
        this.start();
    }

}

module.exports = Controller;
