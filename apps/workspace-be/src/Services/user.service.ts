import "dotenv/config";
import taskModel from "../Models/task.model.js";
import userModel from "../Models/user.model.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import type { UploadImageInput } from "../Models/type.js";

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
      .populate("project", "title projectName _id");
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
    const storage = getStorage();

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.mimeType,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + file.originalName);
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);

    // Update user document with new avatar URL
    let updatedUser;

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            console.log("User canceled the upload");
            break;
          case "storage/unknown":
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updatedUser = userModel.findByIdAndUpdate(
            userId,
            { avatar: downloadURL },
            { new: true },
          );
        });
      },
    );

    return updatedUser;
  } catch (error: any) {
    throw { status: 500, message: error.message || error };
  }
};
