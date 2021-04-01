const Controller = load.class('controller');
const Studio = load.singleton('studio/studio');

class MainController extends Controller {

    async start() {
        await Studio.start();
        this.createFormWindow('main');
    }

}

module.exports = MainController;