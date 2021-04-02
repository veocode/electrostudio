const Project = load.class('studio/project');

class Studio {

    project;

    start() {
        const lastProjectFolder = settings.get('lastProjectFolder', null);
        console.log('lastProjectFolder', lastProjectFolder);
        return this.initProject(lastProjectFolder);
    }

    initProject(folder = null) {
        this.project = new Project(folder);
        return this.project.load();
    }

}

module.exports = Studio;