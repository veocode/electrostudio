const Project = load.class('studio/project');

class Studio {

    project;
    compiler;

    async start() {
        this.project = load.instance('classes/studio/project')
        this.compiler = load.instance('classes/studio/compiler');
    }

    async isFolderContainsProject(folder) {
        return await this.project.isFolderContainsProject(folder);
    }

    async isFolderSuitableForNewProject(folder) {
        return await this.project.isFolderSuitableForNewProject(folder);
    }

    loadProject(folder) {
        this.project.setFolder(folder);
        return this.project.load();
    }

    async saveProject() {
        await this.compiler.compileProject(this.project);
        this.project.setDirty(false);
    }

    saveProjectFile(filePath, content) {
        return load.write(filePath, content);
    }

}

module.exports = Studio;