class ProjectModel {
    constructor(id = '', title = '', description = '', host = {}, participants = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.host = host;
        this.participants = participants;
    }
}

export default ProjectModel;
