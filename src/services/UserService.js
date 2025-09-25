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

export const changeUserInfoService = async (userId, userData) => {
    try {
        const { data } = await http.put(`/api/user/${userId}`, userData);
        return data;
    } catch (error) {
        console.error('Error changing user information:', error);
        throw error;
    }
};
