/**
 * TaskModel represents an individual task within a project.
 * It tracks its timeline, assignees, and completion status.
 */
class TaskModel {
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

    static fromObject(task) {
        return new TaskModel(
            task._id ?? task.id ?? null,
            task.title || '',
            task.description || '',
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
