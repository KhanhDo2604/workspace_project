/**
 * Handles all user authentication and authorization operations, including login, signup, password reset, and logout. All requests
 * are made through Axios to the backend authentication endpoints.
 */
import http from '../api/http';

/**
 * Authenticate a user with email and password.
 * @async
 * @param {string} email - User’s email address.
 * @param {string} password - User’s password.
 * @returns {Promise<Object>} The authenticated user data with token.
 */
export const login = async (email, password) => {
    const { data } = await http.post('api/auth/login', { email: email, password: password });
    return data;
};

/**
 * Register a new user.
 * @async
 * @param {string} email - User’s email address.
 * @param {string} password - Desired password.
 * @param {string} userName - User’s display name.
 * @returns {Promise<Object>} The newly registered user data.
 */
export const signup = async (email, password, userName) => {
    const { data } = await http.post('api/auth/signup', { userName: userName, email: email, password: password });
    return data;
};

/**
 * Request a password reset link to be sent via email.
 * @async
 * @param {string} email - The email associated with the account.
 * @returns {Promise<Object>} Confirmation of email dispatch.
 */
export const requestPasswordReset = async (email) => {
    const { data } = await http.post('api/auth/forgot-password', { email: email });
    return data;
};

/**
 * Reset the user’s password using token-based authentication.
 * @async
 * @param {string} userId - User’s ID.
 * @param {string} token - Verification token from email.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<Object>} Password reset confirmation.
 */
export const resetPassword = async (userId, token, newPassword) => {
    const { data } = await http.post('api/auth/reset-password', {
        userId: userId,
        token: token,
        password: newPassword,
    });
    return data;
};

/**
 * Log out the current user and clear local storage.
 * @async
 * @returns {Promise<Object>} Logout confirmation from server.
 */
export const logout = async () => {
    const result = await http.post('api/auth/sign-out');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    return result;
};
