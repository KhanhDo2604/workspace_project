/**
 * TaskModel represents an individual task within a project.
 * It tracks its timeline, assignees, and completion status.
 */
class TaskModel {
    /**
     * @constructor
     * @param {string} id - Task identifier.
     * @param {string} title - Task title.
     * @param {string} description - Task details.
     * @param {number} startDay - Task start timestamp.
     * @param {number} dueDay - Task due timestamp.
     * @param {Array<object>} userIds - Assigned users.
     * @param {int} status - Current status (e.g., 0 for "To do", 1 for "In Progress").
     * @param {Array<string>} types - Task categories or labels.
     * @param {Array<Object>} subtasks - List of subtasks.
     * @param {Object|null} project - Reference to the parent project.
     */
    constructor(
        id,
        title,
        description,
        startDay,
        dueDay,
        userIds = [],
        status,
        types = [],
        subtasks = [],
        project = null,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDay = startDay;
        this.dueDay = dueDay;
        this.types = types;
        this.userIds = userIds;
        this.status = status;
        this.subtasks = subtasks;
        this.project = project;
    }

    /**
     * Factory method to construct a TaskModel from raw backend payload.
     * @param {Object} task - The backend task object.
     * @returns {TaskModel}
     */
    static fromPayload(task) {
        return new TaskModel(
            task._id,
            task.title,
            task.description,
            task.startDay,
            task.dueDay,
            task.userIds || [],
            task.status,
            task.types || [],
            task.subTasks || [],
            task.project || null,
        );
    }
}

export default TaskModel;
