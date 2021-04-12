const Project = load.class('studio/project');

class Studio {

    project;
    compiler;

    async start() {
        this.project = load.instance('classes/studio/project')
        this.compiler = load.instance('classes/studio/compiler');
    }

    loadProject(folder) {
        this.project.setFolder(folder);
        return this.project.load();
    }

    saveProject() {
        return this.compiler.compileProject(this.project);
    }

    async isFolderContainsProject(folder) {
        return await this.project.isFolderContainsProject(folder);
    }

    async isFolderSuitableForNewProject(folder) {
        return await this.project.isFolderSuitableForNewProject(folder);
    }

}

module.exports = Studio;