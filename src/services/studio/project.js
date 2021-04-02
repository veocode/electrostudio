const Service = load.class('service');
const Studio = load.singleton('classes/studio/studio');

class ProjectService extends Service {

    getServiceObject() {
        return Studio.project;
    }

}

module.exports = ProjectService;