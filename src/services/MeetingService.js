import http from '../api/http';

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

export const deleteMeetingService = async (meetingId) => {
    try {
        const { data } = await http.delete(`/api/project/delete-meeting/${meetingId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMeetingsByUserIdService = async (userId) => {
    try {
        const { data } = await http.get(`/api/project/get-meetings/${userId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getMeetingsByProjectIdService = async (projectId) => {
    try {
        const { data } = await http.get(`/api/project/get-meetings-project/${projectId}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
