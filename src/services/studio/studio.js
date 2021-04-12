const Service = load.class('service');
const Studio = load.singleton('classes/studio/studio');

class StudioService extends Service {

    getServiceObject() {
        return Studio;
    }

}

module.exports = StudioService;