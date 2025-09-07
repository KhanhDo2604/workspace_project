import http from '../api/http';

export const login = async (email, password) => {
    const { data } = await http.post('api/auth/login', { email: email, password: password });
    return data;
};

export const signup = async (email, password, userName) => {
    const { data } = await http.post('api/auth/signup', { userName: userName, email: email, password: password });
    return data;
};

export const requestPasswordReset = async (email) => {
    const { data } = await http.post('api/auth/forgot-password', { email: email });
    return data;
};

export const resetPassword = async (userId, token, newPassword) => {
    const { data } = await http.post('api/auth/reset-password', {
        userId: userId,
        token: token,
        password: newPassword,
    });
    return data;
};

export const logout = async () => {
    const result = await http.post('api/auth/sign-out');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    return result;
};
