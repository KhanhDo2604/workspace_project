import { Router } from "express";
import {
  addMemberToProjectController,
  createMeetingController,
  createProjectController,
  createTaskController,
  deleteMeetingController,
  deleteProjectController,
  deleteTaskController,
  getAllProjectsController,
  getChatInProjectController,
  getProjectMeetingsByUserIdController,
  getProjectMeetingsController,
  getProjectTasksController,
  removeMemberFromProjectController,
  updateMeetingController,
  updateProjectController,
  updateTaskController,
  updateTaskStatusController,
} from "../Controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/user/:userId", getAllProjectsController);

projectRouter.get("/get-chat/:projectId", getChatInProjectController);

projectRouter.get("/get-task/:projectId", getProjectTasksController);

projectRouter.get(
  "/get-meetings/:userId",
  getProjectMeetingsByUserIdController
);

projectRouter.get(
  "/get-meetings-project/:projectId",
  getProjectMeetingsController
);

projectRouter.post("/create", createProjectController);

projectRouter.post("/create-task/:project", createTaskController);

projectRouter.post("/create-meeting", createMeetingController);

projectRouter.put("/add-member", addMemberToProjectController);

projectRouter.put("/remove-member", removeMemberFromProjectController);

projectRouter.put("/update/:projectId", updateProjectController);

projectRouter.put("/update-task/:taskId", updateTaskController);

projectRouter.put("/update-status/:taskId", updateTaskStatusController);

projectRouter.put("/update-meeting/:meetingId", updateMeetingController);

projectRouter.delete("/delete-task/:taskId", deleteTaskController);

projectRouter.delete("/delete/:projectId", deleteProjectController);

projectRouter.delete("/delete-meeting/:meetingId", deleteMeetingController);

export default projectRouter;
