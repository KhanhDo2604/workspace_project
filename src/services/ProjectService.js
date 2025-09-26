import http from '../api/http';
import ChatModel from '../model/ChatModel';

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

export const deleteProjectService = async (projectId) => {
    try {
        const { data } = await http.delete(`api/project/delete/${projectId}`);
        return data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

export const getAllProjectsService = async (userId) => {
    try {
        const { data } = await http.get(`api/project/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getChatMessagesService = async (projectId) => {
    try {
        const { data } = await http.get(`api/project/get-chat/${projectId}`);
        console.log(data);

        return data.chat.map((msg) => ChatModel.fromJson(msg)).sort((a, b) => a.createdAt - b.createdAt);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
    }
};

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

export const deleteTaskService = async (taskId) => {
    try {
        const { data } = await http.delete(`api/project/delete-task/${taskId}`);
        return data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

export const getProjectTasksService = async (projectId) => {
    try {
        const { data } = await http.get(`api/project/get-task/${projectId}`);

        return data;
    } catch (error) {
        console.error('Error fetching project tasks:', error);
        throw error;
    }
};
