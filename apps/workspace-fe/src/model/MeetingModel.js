/**
 * MeetingModel represents a meeting entity within a project.
 * It encapsulates meeting metadata such as timing, participants, and host.
 */
class MeetingModel {
    constructor(id, projectId, title, startTime, endTime, participants, host) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.participants = participants;
        this.host = host;
    }

    static fromObject(meeting) {
        return new MeetingModel(
            meeting._id ?? meeting.id ?? null,
            meeting.projectId ?? null,
            meeting.title || '',
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
