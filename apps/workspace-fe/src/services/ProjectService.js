/**
 * This module defines service-layer functions responsible for communicatingwith the backend API regarding project, task, and collaboration operations.
 * Each function returns server responses for higher-level components to consume.
 */
import http from '../api/http';
import ChatModel from '../model/ChatModel';

/**
 * Creates a new project for a user.
 * @param {string} title - The project title displayed in the dashboard.
 * @param {string} projectName - Internal project identifier or slug.
 * @param {string} userId - ID of the user who owns the project.
 * @param {string} color - Color code used to represent the project visually.
 * @returns {Promise<Object>} Newly created project data.
 */
export const createProjectService = async (title, projectName, userId, color) => {
    try {
        const { data } = await http.post('api/project/create', {
            title: title,
            projectName: projectName,
            userId: userId,
            color: color,
        });

        return data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

/**
 * Updates an existing project’s basic information or participants.
 * @param {string} projectId - The project’s unique identifier.
 * @param {string} title - Updated title of the project.
 * @param {string} projectName - Updated internal name.
 * @param {Array} participants - Updated list of user objects.
 * @returns {Promise<Object>} Updated project data.
 */
export const updateProjectService = async (projectId, title, projectName, participants) => {
    try {
        const { data } = await http.put(`api/project/update/${projectId}`, {
            title: title,
            projectName: projectName,
            participants: participants,
        });
        return data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};

/**
 * Deletes a project by ID.
 * @param {string} projectId - ID of the project to delete.
 * @returns {Promise<Object>} Deletion confirmation.
 */
export const deleteProjectService = async (projectId) => {
    try {
        const { data } = await http.delete(`api/project/delete/${projectId}`);
        return data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

/**
 * Fetches all projects owned or joined by a specific user.
 * @param {string} userId - The user’s unique identifier.
 * @returns {Promise<Array>} List of project objects.
 */
export const getAllProjectsService = async (userId) => {
    try {
        const { data } = await http.get(`api/project/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

/**
 * Retrieves all chat messages associated with a project.
 * @param {string} projectId - ID of the project.
 * @returns {Promise<Array>} Array of ChatModel objects sorted by creation time.
 */
export const getChatMessagesService = async (projectId) => {
    try {
        const { data } = await http.get(`api/project/get-chat/${projectId}`);

        return data.chat.map((msg) => ChatModel.fromJson(msg)).sort((a, b) => a.createdAt - b.createdAt);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
    }
};

/**
 * Adds a new member to an existing project by email.
 * @param {string} projectId - Project identifier.
 * @param {string} email - Email address of the member to add.
 * @returns {Promise<Object>} Updated project data.
 */
export const addMemberToProjectService = async (projectId, email) => {
    try {
        const { data } = await http.put('api/project/add-member', {
            projectId: projectId,
            email: email,
        });
        return data;
    } catch (error) {
        console.error('Error adding member to project:', error);
        throw error;
    }
};

/**
 * Removes a member from a project.
 * @param {string} projectId - The project’s ID.
 * @param {string} memberId - The ID of the member to remove.
 * @returns {Promise<Object>} Updated project data.
 */
export const removeMemberFromProjectService = async (projectId, memberId) => {
    try {
        const { data } = await http.put('api/project/remove-member', {
            projectId: projectId,
            memberId: memberId,
        });
        return data;
    } catch (error) {
        console.error('Error removing member from project:', error);
        throw error;
    }
};

/**
 * Creates a new task within a project.
 * @param {string} project - Project ID.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {Array} assignedTo - Array of user objects assigned to this task.
 * @param {Array} types - Task category or tag types.
 * @param {number} startDay - Unix timestamp for task start date.
 * @param {number} dueDay - Unix timestamp for task deadline.
 * @returns {Promise<Object>} Newly created task data.
 */
export const createTaskService = async (project, title, description, assignedTo, types, startDay, dueDay) => {
    try {
        const getUserIds = assignedTo.map((user) => user._id);
        const { data } = await http.post('api/project/create-task/' + project, {
            title: title,
            description: description,
            userIds: getUserIds,
            types: types,
            startDay: startDay,
            dueDay: dueDay,
        });
        return data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

/**
 * Update an existing task.
 * @async
 * @param {string} taskId - Task ID.
 * @param {string} title - Updated title.
 * @param {string} description - Updated description.
 * @param {Array<string>} userIds - Assigned user IDs.
 * @param {Array<string>} types - Updated task types.
 * @param {number} startDay - New start date.
 * @param {number} dueDay - New due date.
 * @returns {Promise<Object>} The updated task data.
 */
export const updateTaskService = async (taskId, title, description, userIds, types, startDay, dueDay) => {
    try {
        const { data } = await http.put(`api/project/update-task/${taskId}`, {
            title: title,
            description: description,
            userIds: userIds,
            types: types,
            startDay: startDay,
            dueDay: dueDay,
        });
        return data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

/**
 * Update the status of a task (e.g., “To Do”, “In Progress”, “Done”).
 * @async
 * @param {string} taskId - Task ID.
 * @param {string} status - New status label.
 * @returns {Promise<Object>} Updated task data.
 */
export const updateTaskStatusService = async (taskId, status) => {
    try {
        const { data } = await http.put(`api/project/update-status/${taskId}`, {
            status: status,
        });
        return data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
    }
};

/**
 * Delete a task permanently.
 * @async
 * @param {string} taskId - Task ID.
 * @returns {Promise<Object>} Deletion confirmation include taskId.
 */
export const deleteTaskService = async (taskId) => {
    try {
        const { data } = await http.delete(`api/project/delete-task/${taskId}`);
        return data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

/**
 * Retrieve all tasks associated with a specific project.
 * @async
 * @param {string} projectId - Project ID.
 * @returns {Promise<Array>} List of project tasks.
 */
export const getProjectTasksService = async (projectId) => {
    try {
        const { data } = await http.get(`api/project/get-task/${projectId}`);

        return data;
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        throw error;
    }
};
