const Controller = load.class('controller');
const Studio = load.singleton('classes/studio/studio');

class MainController extends Controller {

    async start() {
        await Studio.start();
        this.createFormWindow('splash');
    }

}

module.exports = MainController;