class MeetingModel {
    constructor(id, projectId, title, startTime, endTime, participants) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.participants = participants;
    }

    static fromPayload(meeting) {
        return new MeetingModel(
            meeting._id,
            meeting.projectId,
            meeting.title,
            meeting.startTime,
            meeting.endTime,
            meeting.participants || [],
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
        };
    }
}

export default MeetingModel;
