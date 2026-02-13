import type { Request, Response } from "express";
import {
  addMemberToProject,
  createMeeting,
  createProject,
  createTask,
  deleteMeeting,
  deleteProject,
  deleteTask,
  getAllProject,
  getProjectMeetings,
  getProjectMeetingsByUserId,
  getProjectTasks,
  removeMemberFromProject,
  updateMeeting,
  updateProject,
  updateTask,
  updateTaskStatus,
} from "../Services/project.service.js";
import { getChatInProject } from "../Services/chat.service.js";

/**
 * Get all projects belonging to a specific user.
 * @route   GET /api/project/user/:userId
 */
export const getAllProjectsController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "No token provided" });
  }

  const projects = await getAllProject(userId as string);

  res.status(200).json({ message: "Success", projects: projects });
};

/**
 * Retrieve chat messages belonging to a specific project.
 * @route   GET /api/project/get-chat/:projectId
 */
export const getChatInProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "No projectId provided" });
    }

    const chat = await getChatInProject(projectId as string);
    res.status(200).json({ message: "Success", chat });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error fetching chat", error: error.message });
  }
};

/**
 * Create a new project and associate it with a user.
 * @route   POST /api/project/create
 */
export const createProjectController = async (req: Request, res: Response) => {
  try {
    const { userId, projectName, title, color } = req.body;

    const result = await createProject(userId, projectName, title, color);
    res.json({ message: result.message, project: result.project });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

/**
 * Update an existing project’s information.
 * @route   PUT /api/project/update/:projectId
 */
export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { title, projectName, participants } = req.body;
    const { projectId } = req.params;

    if (!projectId || !title || !projectName || !participants) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await updateProject(
      projectId as string,
      title,
      projectName,
      participants,
    );
    res
      .status(result.status)
      .json({ message: "Project updated", project: result.project });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

/**
 * Delete an existing project by ID.
 * @route   DELETE /api/project/delete/:projectId
 */
export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "No projectId provided" });
    }

    const result = await deleteProject(projectId as string);
    res
      .status(result.status)
      .json({ message: result.message, projectId: result.projectId });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

/**
 * Add a new member to a project using their email address.
 * @route   PUT /api/project/add-member
 */
export const addMemberToProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId, email } = req.body;
    if (!projectId || !email) {
      return res.status(400).json({ message: "Missing projectId or email" });
    }

    const result = await addMemberToProject(projectId, email);
    res.status(result.status).json({
      message: result.message,
      project: result.project,
      user: result.user,
    });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error adding member", error: error.message });
  }
};

/**
 * Remove a member from a project.
 * @route PUT /api/project/remove-member
 */
export const removeMemberFromProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId, memberId } = req.body;
    if (!projectId || !memberId) {
      return res.status(400).json({ message: "Missing projectId or memberId" });
    }
    const result = await removeMemberFromProject(projectId, memberId);

    res
      .status(result.status)
      .json({ message: result.message, project: result.project });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error removing member", error: error.message });
  }
};

// Task
/**
 * Retrieve all tasks associated with a project.
 * @route GET /api/project/get-task/:projectId
 */
export const getProjectTasksController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "No projectId provided" });
    }

    const result = await getProjectTasks(projectId as string);

    res.status(result.status).json({ tasks: result.tasks });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error fetching project tasks", error: error.message });
  }
};

/**
 * Create a new task within a project.
 * @route POST /api/project/create-task/:project
 */
export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { project } = req.params;
    const { userIds, title, description, startDay, dueDay, types } = req.body;

    if (
      !project ||
      !userIds ||
      !title ||
      !description ||
      !startDay ||
      !dueDay
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await createTask(
      userIds,
      project as string,
      title,
      description,
      startDay,
      dueDay,
      types,
    );

    res
      .status(result.status)
      .json({ message: "Create a new task", task: result.task });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

/**
 * Update an existing task.
 * @route PUT /api/project/update-task/:taskId
 */
export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { userIds, title, description, startDay, dueDay, types, status } =
      req.body;

    console.log(req.body);

    if (!taskId) {
      return res.status(400).json({ message: "No taskId provided" });
    }
    const result = await updateTask(
      taskId as string,
      userIds,
      title,
      description,
      startDay,
      dueDay,
      types,
      status,
    );

    res
      .status(result.status)
      .json({ message: "Task updated", task: result.task });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

/**
 * Delete a specific task by ID.
 * @route DELETE /api/project/delete-task/:taskId
 */
export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: "No taskId provided" });
    }

    const result = await deleteTask(taskId as string);
    res
      .status(result.status)
      .json({ message: result.message, taskId: result.taskId });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

/**
 * Update only the status of a specific task.
 * @route PUT /api/project/update-status/:taskId
 */
export const updateTaskStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: "No taskId provided" });
    }
    const result = await updateTaskStatus(taskId as string, status);
    res.status(result.status).json({ message: "Task status updated" });
  } catch (error) {
    console.error("Error in updateTaskStatusController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Meeting
/**
 * Create a new meeting for a project.
 * @route POST /api/project/create-meeting
 */
export const createMeetingController = async (req: Request, res: Response) => {
  try {
    const { projectId, title, startTime, endTime, participants, userId } =
      req.body;
    if (
      !projectId ||
      !title ||
      !startTime ||
      !endTime ||
      !participants ||
      !userId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await createMeeting(
      projectId,
      title,
      startTime,
      endTime,
      participants,
      userId,
    );

    res
      .status(result.status)
      .json({ message: "Meeting created", meeting: result.meeting });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error creating meeting", error: error.message });
  }
};

/**
 * Update details of an existing meeting.
 * @route PUT /api/project/update-meeting/:meetingId
 */
export const updateMeetingController = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const { title, startTime, endTime, participants, projectId } = req.body;

    if (!meetingId) {
      return res.status(400).json({ message: "No meetingId provided" });
    }

    const result = await updateMeeting(meetingId as string, {
      title,
      startTime,
      endTime,
      participants,
      projectId,
    });
    res
      .status(result.status)
      .json({ message: "Meeting updated", meeting: result.meeting });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error updating meeting", error: error.message });
  }
};

/**
 * Delete a meeting by ID.
 * @route DELETE /api/project/delete-meeting/:meetingId
 */
export const deleteMeetingController = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params as { meetingId: string };
    const result = await deleteMeeting(meetingId);

    res
      .status(result.status)
      .json({ message: result.message, meetingId: result.meetingId });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error deleting meeting", error: error.message });
  }
};

/**
 * Get all meetings associated with a user.
 * @route GET /api/project/get-meetings/:userId
 */
export const getProjectMeetingsByUserIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "No userId provided" });
    }

    const result = await getProjectMeetingsByUserId(userId as string);

    if (result.status === 404) {
      return res.status(200).json({ meetings: [] });
    }

    res.status(result.status).json({ meetings: result.meetings });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error fetching meetings", error: error.message });
  }
};

/**
 * Get all meetings for a specific project.
 * @route GET /api/project/get-meetings-project/:projectId
 */
export const getProjectMeetingsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ message: "No projectId provided" });
    }

    const result = await getProjectMeetings(projectId as string);

    if (result.status === 404) {
      return res.status(200).json({ meetings: [] });
    }

    res.status(result.status).json({ meetings: result.meetings });
  } catch (error: Error | any) {
    res
      .status(500)
      .json({ message: "Error fetching meetings", error: error.message });
  }
};
