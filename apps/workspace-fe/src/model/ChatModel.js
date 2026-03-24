/**
 * ChatModel represents a single chat message within a project.
 * It stores metadata about the sender, message content, and time of creation.
 */
class ChatModel {
    constructor({
        id = null,
        projectId = null,
        message = '',
        userId = null,
        avatar = '',
        createdAt = null,
        name = '',
    } = {}) {
        this.id = id;
        this.projectId = projectId;
        this.message = message;
        this.userId = userId;
        this.avatar = avatar;
        this.name = name;
        this.createdAt = createdAt;
    }

    static fromObject(json) {
        return new ChatModel({
            id: json._id ?? json.id ?? null,
            projectId: json.projectId ?? null,
            message: json.message || '',
            userId: json.userId || null,
            avatar: json.avatar || '',
            createdAt: json.createdAt || null,
            name: json.name || '',
        });
    }
}

export default ChatModel;
