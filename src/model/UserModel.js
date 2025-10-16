/**
 * UserModel represents the authenticated or registered user.
 * It defines the core identity and personal settings of a user.
 */
class UserModel {
    /**
     * @constructor
     * @param {string} id - User identifier.
     * @param {string} avatar - Profile picture URL.
     * @param {string} name - Full name of the user.
     * @param {string} email - Registered email address.
     * @param {string} token - Authentication token.
     * @param {Object} personalSetting - User-specific configuration reference.
     */
    constructor(id, avatar, name, email, token, personalSetting) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.email = email;
        this.token = token;
        this.personalSetting = personalSetting;
    }
}

export default UserModel;
