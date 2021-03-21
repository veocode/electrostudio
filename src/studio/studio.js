const Project = load.studio('project');

class Studio {

    project;

    start() {
        return this.initProject();
    }

    initProject(folder = null) {
        this.project = new Project(folder);
        return this.project.load();
    }

}

module.exports = Studio;