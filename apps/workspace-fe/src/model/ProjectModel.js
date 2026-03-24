/**
 * ProjectModel stores project-level information,
 * including metadata such as title, description, and participants.
 */
class ProjectModel {
    constructor(id = '', title = '', description = '', host = {}, participants = [], color = '') {
        this.id = id;
        this.title = title;
        this.description = description;
        this.host = host;
        this.participants = participants;
        this.color = color;
    }

    static fromObject(obj) {
        if (!obj) return null;

        return new ProjectModel(
            obj.id ?? obj._id ?? null,
            obj.title ?? null,
            obj.description ?? null,
            obj.host ?? {},
            obj.participants ?? [],
            obj.color ?? '',
        );
    }
}

export default ProjectModel;
