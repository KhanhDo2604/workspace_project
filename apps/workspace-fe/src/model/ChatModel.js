/**
 * ChatModel represents a single chat message within a project.
 * It stores metadata about the sender, message content, and time of creation.
 */
class ChatModel {
    /**
     * @constructor
     * @param {Object} params - Chat data object.
     * @param {string|null} params.id - Unique identifier of the chat message.
     * @param {string|null} params.projectId - ID of the project this message belongs to.
     * @param {string} params.message - The message content.
     * @param {string|null} params.userId - ID of the user who sent the message.
     * @param {string} params.avatar - User avatar URL.
     * @param {string} params.name - Display name of the sender.
     * @param {Date|null} params.createdAt - Timestamp of when the message was created.
     */
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

    /**
     * Creates a ChatModel instance from a JSON object.
     * @param {Object} json - The raw chat data from server or database.
     * @returns {ChatModel}
     */
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
