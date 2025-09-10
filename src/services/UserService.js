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
