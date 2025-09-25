class ProjectModel {
    constructor(id = '', title = '', description = '', host = {}, participants = [], color = '') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.host = host;
        this.participants = participants;
        this.color = color;
    }
}

export default ProjectModel;
