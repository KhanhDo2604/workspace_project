/**
 * ProjectModel stores project-level information,
 * including metadata such as title, description, and participants.
 */
class ProjectModel {
    /**
     * @constructor
     * @param {string} id - Unique identifier of the project.
     * @param {string} title - Project title.
     * @param {string} description - Short description of the project.
     * @param {Object} host - Host or owner information.
     * @param {Array<Object>} participants - List of project participants.
     * @param {string} color - Theme color of the project card.
     */
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
