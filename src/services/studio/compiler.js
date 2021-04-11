const Service = load.class('service');
const Studio = load.singleton('classes/studio/studio');

class CompilerService extends Service {

    getServiceObject() {
        return Studio.compiler;
    }

}

module.exports = CompilerService;