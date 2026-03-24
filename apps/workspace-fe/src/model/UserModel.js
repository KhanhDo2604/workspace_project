/**
 * UserModel represents the authenticated or registered user.
 * It defines the core identity and personal settings of a user.
 */
class UserModel {
    constructor(id, avatar, name, email, keycloakId, personalSetting) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.email = email;
        this.keycloakId = keycloakId;
        this.personalSetting = personalSetting;
    }

    static fromObject(obj) {
        if (!obj) return null;

        return new UserModel(
            obj.id ?? obj._id ?? null,
            obj.avatar ?? null,
            obj.name ?? obj.fullName ?? null,
            obj.email ?? null,
            obj.keycloakId ?? obj.keycloak_id ?? null,
            obj.personalSetting ?? {},
        );
    }
}

export default UserModel;
