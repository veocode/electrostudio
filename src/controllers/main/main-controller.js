const Controller = load.class('controller');
const app = load.electron('app');

class MainController extends Controller {

    boot() {

    }

    async start() {
        await this.createFormWindow('main');
        this.getWindow('main').on('close', () => app.quit());
    }

}

module.exports = MainController;