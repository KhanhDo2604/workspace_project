/**
 * Axios HTTP instance configuration for the Collaborative Workspace frontend.
 * This module centralizes all HTTP request logic and automatically
 * attaches the authentication token (JWT) to every outbound request.
 * It ensures consistent API communication with the backend server.
 */
import axios from 'axios';

// Create a pre-configured Axios instance with a common base URL
// and default headers for all requests.
const http = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Backend server URL from environment variables
    headers: { 'Content-Type': 'application/json' }, // All requests send/receive JSON data
});

/**
 * Before each request is sent, this interceptor checks whether
 * a valid JWT token exists in localStorage. If found, it attaches
 * the token to the Authorization header to authenticate the user.
 */
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    // Attach the token to the Authorization header if available
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;
