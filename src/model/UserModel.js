class UserModel {
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
