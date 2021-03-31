const Service = load.class('service');
const Studio = load.singleton('studio/studio');

class ProjectService extends Service {

    getServiceObject() {
        return Studio.project;
    }

}

module.exports = ProjectService;