/**
 * This file handles all API interactions related to user data, including profile retrieval, updates, avatar management, and
 * user-specific task queries.
 */
import http from '../api/http';

/**
 * Retrieve detailed information of a specific user.
 * @async
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object>} The user data retrieved from the backend.
 */
export const getUserInfoService = async (userId) => {
    try {
        const { data } = await http.get(`/api/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error;
    }
};

/**
 * Retrieve all tasks assigned to a specific user.
 * @async
 * @param {string} userId - The ID of the user whose tasks are requested.
 * @returns {Promise<Array>} A list of tasks associated with the user.
 */
export const getAllUsersTaskService = async (userId) => {
    try {
        const { data } = await http.get(`/api/user/get-task/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        throw error;
    }
};

/**
 * Update the user’s name.
 * @async
 * @param {string} userId - The user’s ID.
 * @param {string} newName - The new name to assign to the user.
 * @returns {Promise<Object>} The updated user data.
 */
export const changeUserInfoService = async (userId, newName) => {
    try {
        const { data } = await http.put(`api/user/change_name/${userId}`, { newName: newName });
        return data;
    } catch (error) {
        console.error('Error changing user information:', error);
        throw error;
    }
};

/**
 * Update the user’s avatar image.
 * @async
 * @param {string} userId - The user’s ID.
 * @param {File} file - The uploaded image file.
 * @returns {Promise<Object>} The updated user object with new avatar.
 */
export const updateUserAvatarService = async (userId, file) => {
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);

        const { data } = await http.post('api/user/change-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return data.user;
    } catch (error) {
        console.error('Error updating user avatar:', error);
        throw error;
    }
};
