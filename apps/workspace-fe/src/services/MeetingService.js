/**
 * This file manages all meeting-related API operations including creation, updates, deletion, and retrieval for both user-based
 * and project-based meeting data.
 */
import http from '../api/http';

/**
 * Create a new meeting.
 * @async
 * @param {Object} meetingData - Object containing meeting details.
 * @param {string} meetingData.title - The meeting title.
 * @param {number} meetingData.startTime - Start timestamp.
 * @param {number} meetingData.endTime - End timestamp.
 * @param {Array<string>} meetingData.participants - List of user IDs.
 * @param {string} meetingData.projectId - Related project ID.
 * @param {string} meetingData.userId - Creator’s user ID.
 * @returns {Promise<Object>} The created meeting data.
 */
export const createMeetingService = async (meetingData) => {
    try {
        const { data } = await http.post('/api/project/create-meeting', {
            title: meetingData.title,
            startTime: meetingData.startTime,
            endTime: meetingData.endTime,
            participants: meetingData.participants,
            projectId: meetingData.projectId,
            userId: meetingData.userId,
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const scheduledMeetingStartService = async (meetingId) => {
    try {
        const { data } = await http.get(`/api/project/scheduled-meeting-start/${meetingId}`);

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Update an existing meeting.
 * @async
 * @param {Object} meetingData - Object containing updated meeting details.
 * @returns {Promise<Object>} The updated meeting data.
 */
export const updateMeetingService = async (meetingData) => {
    try {
        const { data } = await http.put(`/api/project/update-meeting/${meetingData.id}`, {
            title: meetingData.title,
            startTime: meetingData.startTime,
            endTime: meetingData.endTime,
            participants: meetingData.participants,
            projectId: meetingData.projectId,
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Delete a meeting by its ID.
 * @async
 * @param {string} meetingId - The meeting ID.
 * @returns {Promise<Object>} Deletion confirmation data.
 */
export const deleteMeetingService = async (meetingId) => {
    try {
        const { data } = await http.delete(`/api/project/delete-meeting/${meetingId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Retrieve all meetings associated with a specific user.
 * @async
 * @param {string} userId - The user’s ID.
 * @returns {Promise<Array>} List of meetings related to the user.
 */
export const getMeetingsByUserIdService = async (userId) => {
    try {
        const { data } = await http.get(`/api/project/get-meetings/${userId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Retrieve all meetings related to a specific project.
 * @async
 * @param {string} projectId - The project ID.
 * @returns {Promise<Array>} List of meetings for that project.
 */
export const getMeetingsByProjectIdService = async (projectId) => {
    try {
        const { data } = await http.get(`/api/project/get-meetings-project/${projectId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
