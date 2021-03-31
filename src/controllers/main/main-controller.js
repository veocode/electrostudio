const Controller = load.class('controller');
const Utils = load.class('utils');
const Studio = load.singleton('studio/studio');

class MainController extends Controller {

    boot() {

    }

    async start() {
        Studio.start().then(() => {
            this.createFormWindow('main');
        })
    }

}

module.exports = MainController;