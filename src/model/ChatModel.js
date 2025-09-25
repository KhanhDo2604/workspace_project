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

    static fromJson(json) {
        return new ChatModel({
            id: json._id,
            projectId: json.projectId,
            message: json.message || '',
            userId: json.userId || null,
            avatar: json.avatar || '',
            createdAt: json.createdAt || null,
            name: json.name || '',
        });
    }
}

export default ChatModel;
