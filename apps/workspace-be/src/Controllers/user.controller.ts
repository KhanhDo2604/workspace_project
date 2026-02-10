import type { Request, Response } from "express";
import {
  changeUserName,
  getUserById,
  getUserTasks,
  updateUserAvatar,
} from "../Services/user.service.js";

/**
 * Retrieve user information by user ID.
 * @route GET /api/user/:id
 * @param {Request} req - Express request object containing the user ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} Returns user data if found, or an error response.
 */
export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id || "");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update the display name of a user.
 * @route PATCH /api/user/change_name/:userId
 * @param {Request} req - Express request object with userId param and newName in body.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} Returns updated user data or an error message.
 */
export const changeUserNameController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newName } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Invalid param" });
    }

    const data = await changeUserName(userId, newName);
    if (!data.user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user: data.user, message: data.message });
  } catch (error) {
    console.error("Error changing user name:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Fetch all tasks assigned to a given user.
 * @route GET /api/user/get-task/:userId
 * @param {Request} req - Express request object with userId in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} Returns task list or an error response.
 */
export const getUserTasksController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "No userId provided" });
    }

    const result = await getUserTasks(userId);
    res.status(result.status).json({ tasks: result.tasks });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error fetching user tasks", error: error.message });
  }
};

/**
 * Upload and update the user's profile avatar.
 * @route POST /api/user/change-avatar
 * @param {Request} req - Express request object containing multipart/form-data with userId and image file.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} Returns updated user data or error information.
 */
export const updateUserAvatarController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const updatedUser = await updateUserAvatar(userId, file);

    return res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
