/**
 * MeetingModel represents a meeting entity within a project.
 * It encapsulates meeting metadata such as timing, participants, and host.
 */
class MeetingModel {
    /**
     * @param {string} id - Unique identifier for the meeting.
     * @param {string} projectId - Related project ID.
     * @param {string} title - Meeting title.
     * @param {number} startTime - Meeting start time.
     * @param {number} endTime - Meeting end time.
     * @param {Array<object>} participants - Array of participants.
     * @param {object|null} host - Host user or null.
     */
    constructor(id, projectId, title, startTime, endTime, participants, host) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.participants = participants;
        this.host = host;
    }

    /**
     * Converts the current MeetingModel instance into a plain JSON object.
     * Useful for serialization before sending data to the client or database.
     *
     * @returns {object} JSON representation of the meeting.
     */
    static fromPayload(meeting) {
        return new MeetingModel(
            meeting._id,
            meeting.projectId,
            meeting.title,
            meeting.startTime,
            meeting.endTime,
            meeting.participants || [],
            meeting.host || null,
        );
    }

    toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            title: this.title,
            startTime: this.startTime,
            endTime: this.endTime,
            participants: this.participants,
            host: this.host,
        };
    }
}

export default MeetingModel;
