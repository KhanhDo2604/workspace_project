import userModel from "../Models/user.model.js";
import settingModel from "../Models/setting.model.js";

export const synceUserOnFirstLogin = async (keycloakUser: {
  sub: string;
  email: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
}) => {
  try {
    const existingUser = await userModel.findOne({
      keycloakId: keycloakUser.sub,
    });

    if (existingUser) {
      return {
        status: 200,
        data: existingUser,
        message: "Login successful",
      };
    }

    const newSetting = await new settingModel({
      theme: "light",
      language: "en",
    }).save();

    const newUser = await new userModel({
      keycloakId: keycloakUser.sub,
      email: keycloakUser.email,
      name: keycloakUser.given_name
        ? `${keycloakUser.given_name} ${keycloakUser.family_name ?? ""}`.trim()
        : keycloakUser.preferred_username,
      personalSetting: newSetting._id,
    }).save();

    return {
      status: 201,
      data: newUser,
      message: "User created and logged in successfully",
    };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
};

/**
 * Signs out the user by deleting their active session token.
 * @param header - Authorization header from request
 */
export const signout = async (header: any) => {
  try {
    const token = header.split(" ")[1];

    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID as string,
        }),
      },
    );

    if (!response.ok) {
      throw {
        status: 500,
        message: "Error signing out",
        error: "Failed to sign out",
      };
    }

    return { status: 200, message: "Signed out successfully" };
  } catch (err: any) {
    throw { status: 500, message: "Error signing out", error: err.message };
  }
};
