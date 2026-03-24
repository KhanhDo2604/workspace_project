/**
 * Handles all user authentication and authorization operations, including login, signup, password reset, and logout. All requests
 * are made through Axios to the backend authentication endpoints.
 */
import http from '../api/http';
import { keycloak } from '../App';

export const syncUserService = async (token) => {
    const { data } = await http.post(
        'api/auth/sync-user',
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );

    return data;
};

/**
 * Log out the current user and clear local storage.
 * @async
 * @returns {Promise<Object>} Logout confirmation from server.
 */
export const logout = async () => {
    try {
        keycloak.logout({ redirectUri: window.location.origin });
        return 'Logged out successfully';
    } catch (error) {
        console.error('Logout failed:', error);
        throw new Error('Logout failed');
    }
};
