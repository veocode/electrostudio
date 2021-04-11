const Project = load.class('studio/project');

class Studio {

    project;
    compiler = load.instance('classes/studio/compiler');

    start() {
        //const lastProjectFolder = settings.get('lastProjectFolder', null);
        //return this.initProject(lastProjectFolder);
    }

    initProject(folder = null) {
        this.project = new Project(folder);
        return this.project.load();
    }

}

module.exports = Studio;