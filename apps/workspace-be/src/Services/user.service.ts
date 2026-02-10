import "dotenv/config";
import { BlobServiceClient } from "@azure/storage-blob";
import taskModel from "../Models/task.model.js";
import userModel from "../Models/user.model.js";

/**
 * Initialize Azure Blob Service Client
 */
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!AZURE_STORAGE_CONNECTION_STRING)
  throw new Error("Azure Storage connection string not found");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient("pictures");

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
      { new: true }
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
  file: Express.Multer.File
) => {
  try {
    if (!file) throw new Error("No file uploaded");

    const blobName = `${userId}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file data to Azure Blob Storage
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    // Retrieve the URL of the uploaded blob
    const avatarUrl = blockBlobClient.url;

    // Update user document with new avatar URL
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
      .lean();

    return updatedUser;
  } catch (error: any) {
    throw { status: 500, message: error.message || error };
  }
};
