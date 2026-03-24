import "dotenv/config";
import taskModel from "../Models/task.model.js";
import userModel from "../Models/user.model.js";

import type { UploadImageInput } from "../Models/type.js";
import bucket from "../firebase.js";

/**
 * Retrieve user information by ID.
 * Populates the user's personal settings and excludes sensitive fields.
 *
 * @param id - The unique identifier of the user.
 * @returns The user document with personal settings or null if not found.
 */
export const getUserById = async (id: String) => {
  try {
    const user = await userModel
      .findById(id)
      .populate("personalSetting", "theme language") // Include theme and language info
      .select("-password"); // Exclude password for security
    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Update a user's display name.
 *
 * @param userId - The user's unique identifier.
 * @param newName - The new display name to update.
 * @returns A success message and the updated user document.
 */
export const changeUserName = async (userId: String, newName: String) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { name: newName },
      { new: true },
    );

    return { message: "Update successfully", user };
  } catch (error) {
    throw { status: 500, message: error };
  }
};

/**
 * Retrieve all tasks associated with a user.
 *
 * @param userId - The unique identifier of the user.
 * @returns A list of tasks with populated user and project data.
 */
export const getUserTasks = async (userId: string) => {
  try {
    const tasks = await taskModel
      .find({ userIds: userId })
      .populate("userIds", "name email _id")
      .populate("project", "title description _id");
    return { status: 200, tasks };
  } catch (error) {
    throw { status: 500, message: "Internal server error" };
  }
};

// Upload and update the user's avatar in Azure Blob Storage.
export const updateUserAvatar = async (
  userId: string,
  file: UploadImageInput,
) => {
  try {
    if (!file) throw new Error("No file uploaded");

    const fileName = `avatars/${userId}-${Date.now()}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimeType,
      },
    });

    // Make file public (optional)
    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { avatar: publicUrl },
      { new: true },
    );

    return updatedUser;
  } catch (error: any) {
    console.log("backend:", error);
    throw { status: 500, message: error.message || error };
  }
};
