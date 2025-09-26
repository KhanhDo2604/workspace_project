import http from '../api/http';

export const getUserInfoService = async (userId) => {
    try {
        const { data } = await http.get(`/api/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error;
    }
};

export const getAllUsersTaskService = async (userId) => {
    try {
        const { data } = await http.get(`/api/user/get-task/${userId}`);
        return data;
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        throw error;
    }
};

export const changeUserInfoService = async (userId, newName) => {
    try {
        const { data } = await http.put(`api/user/change_name/${userId}`, { newName: newName });
        return data;
    } catch (error) {
        console.error('Error changing user information:', error);
        throw error;
    }
};

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
