const Controller = load.class('controller');
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