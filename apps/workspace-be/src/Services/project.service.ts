import mongoose from "mongoose";
import projectModel from "../Models/project.model.js";
import taskModel from "../Models/task.model.js";
import userModel from "../Models/user.model.js";
import meetingModel from "../Models/meeting.model.js";
import chatModel from "../Models/chat.model.js";
import type { Server, Socket } from "socket.io";
import schedule from "node-schedule";

/** Represents the payload when a user joins a meeting room. */
interface JoinRoomPayload {
  roomId: string;
  peerId: string;
  userName: string;
  avatar?: string;
}

/** Describes a connected user’s real-time state within a meeting room. */
type RoomUser = {
  userName: string;
  isMicOn: boolean;
  isCamOn: boolean;
  avatar?: string;
};

const roomUsers = new Map<string, Map<string, RoomUser>>(); // roomId -> peerId -> user
const roomPeers = new Map<string, Map<string, string>>(); // roomId -> peerId -> socketId
const whiteboardSnapshots = new Map<string, string>(); // roomId -> lastCanvasBase64
const whiteboards = new Map<string, string>(); // roomId → last canvas snapshot
const meetingStates: Record<string, boolean> = {}; // projectId → instant meeting state

/**
 * Retrieves the socket ID for a given peer in a specific room.
 * @param roomId - The room identifier.
 * @param peerId - The unique peer identifier.
 * @returns The socket ID or undefined if not found.
 */
function getSocketId(roomId: string, peerId: string): string | undefined {
  return roomPeers.get(roomId)?.get(peerId);
}

/**
 * Cleans up empty rooms from the server state once all users leave.
 * @param roomId - The ID of the room to check.
 */
function cleanupRoomIfEmpty(roomId: string) {
  const peers = roomPeers.get(roomId);
  const users = roomUsers.get(roomId);
  const empty = (!peers || peers.size === 0) && (!users || users.size === 0);

  if (empty) {
    roomPeers.delete(roomId);
    roomUsers.delete(roomId);
    whiteboardSnapshots.delete(roomId);
    console.log(`🧹 Cleaned up empty room ${roomId}`);
  }
}

/**
 * Registers socket event handlers for collaborative whiteboard updates.
 * @param io - The main Socket.IO server instance.
 */
export function registerWhiteboardHandlers(io: Server) {
  const nsp = io.of("/whiteboard");

  nsp.on("connection", (socket: Socket) => {
    console.log("🟢 Whiteboard client connected:", socket.id);

    socket.on("join-whiteboard", (roomId: string) => {
      socket.join(roomId);
      console.log(`📄 ${socket.id} joined whiteboard ${roomId}`);

      const last = whiteboards.get(roomId);
      if (last) socket.emit("canvas-data", last);
    });

    socket.on("drawing-data", (data: string) => {
      const roomId = Array.from(socket.rooms).find((r) => r !== socket.id);
      if (!roomId) return;
      whiteboards.set(roomId, data);
      console.log(
        "🖌️ Received drawing-data from",
        socket.id,
        "→ broadcast to",
        roomId,
      );

      socket.to(roomId).emit("canvas-data", data);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Whiteboard disconnected:", socket.id);
    });
  });
}

/** Registers socket event handlers for meeting functionalities including user connections, signaling, and whiteboard snapshots.
 * @param io - The main Socket.IO server instance.
 */
export function registerMeetingHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Meeting socket connected:", socket.id);

    socket.on("canvasImage", ({ data }: { data: string }) => {
      const roomId = socket.data.user?.roomId as string | undefined;
      if (!roomId) {
        console.warn("⚠️ canvasImage received before join-room:", socket.id);
        return;
      }

      whiteboardSnapshots.set(roomId, data);
      socket.to(roomId).emit("canvasImage", { data });

      console.log(`🧾 canvasImage from ${socket.id} in room ${roomId}`);
    });

    socket.on(
      "join-room",
      ({ roomId, peerId, userName, avatar }: JoinRoomPayload) => {
        socket.data.user = { roomId };

        if (socket.rooms.has(roomId)) return;

        if (!roomPeers.has(roomId)) roomPeers.set(roomId, new Map());
        if (!roomUsers.has(roomId)) roomUsers.set(roomId, new Map());

        roomPeers.get(roomId)!.set(peerId, socket.id);
        roomUsers.get(roomId)!.set(peerId, {
          userName,
          isMicOn: true,
          isCamOn: true,
          ...(avatar ? { avatar } : {}),
        });

        socket.data.user = { peerId, userName, roomId, avatar };
        socket.join(roomId);

        console.log(`👥 ${userName} (${peerId}) joined room ${roomId}`);

        const otherUsers = Array.from(roomUsers.get(roomId)!.entries())
          .filter(([pid]) => pid !== peerId)
          .map(([pid, info]) => ({
            peerId: pid,
            userName: info.userName,
            isMicOn: info.isMicOn,
            isCamOn: info.isCamOn,
            ...(info.avatar ? { avatar: info.avatar } : {}),
          }));

        socket.emit("room-users", otherUsers);

        socket.to(roomId).emit("user-connected", {
          peerId,
          userName,
          isMicOn: true,
          isCamOn: true,
          ...(avatar ? { avatar } : {}),
        });

        const last = whiteboardSnapshots.get(roomId);
        if (last) socket.emit("canvasImage", { data: last });

        socket.on("offer", ({ to, offer }) => {
          const target = getSocketId(roomId, to);
          if (target) io.to(target).emit("offer", { from: peerId, offer });
        });

        socket.on("answer", ({ to, answer }) => {
          const target = getSocketId(roomId, to);
          if (target) io.to(target).emit("answer", { from: peerId, answer });
        });

        socket.on("candidate", ({ to, candidate }) => {
          const target = getSocketId(roomId, to);
          if (target)
            io.to(target).emit("candidate", { from: peerId, candidate });
        });

        socket.on("update-status", ({ isMicOn, isCamOn }) => {
          const user = roomUsers.get(roomId)?.get(peerId);
          if (user) {
            if (typeof isMicOn === "boolean") user.isMicOn = isMicOn;
            if (typeof isCamOn === "boolean") user.isCamOn = isCamOn;
          }

          socket.to(roomId).emit("user-status-updated", {
            peerId,
            ...(typeof isMicOn === "boolean" ? { isMicOn } : {}),
            ...(typeof isCamOn === "boolean" ? { isCamOn } : {}),
          });
        });

        socket.on("disconnect", () => {
          const rId = socket.data.user?.roomId;
          if (rId) {
            roomPeers.get(rId)?.delete(peerId);
            roomUsers.get(rId)?.delete(peerId);
            socket.to(rId).emit("user-disconnected", { peerId });
            cleanupRoomIfEmpty(rId);
          }

          console.log(`❌ ${peerId} left meeting room ${roomId}`);
        });
      },
    );
  });
}

/** Initializes and manages the instant meeting state for projects using Socket.IO.
 * @param io - The main Socket.IO server instance.
 */
export const instantiateMeetingState = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("✅ New socket connected");

    socket.on("join_project", (projectId) => {
      socket.join(projectId);
      console.log(`👥 User joined project ${projectId}`);

      socket.emit("meeting_state_update", meetingStates[projectId] || false);
    });

    socket.on("toggle_instant_meeting", (projectId) => {
      meetingStates[projectId] = !meetingStates[projectId];

      io.to(projectId).emit("meeting_state_update", meetingStates[projectId]);
      console.log(
        `🔄 Meeting state for ${projectId}: ${meetingStates[projectId]}`,
      );
    });

    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
  });
};

// Project services
/** Retrieves all projects associated with a specific user, including host and participant details.
 * @param userId - The ID of the user whose projects are to be fetched.
 * @returns An array of projects or an empty array if none are found.
 */
export const getAllProject = async (userId: string) => {
  try {
    const projects = await projectModel
      .find({
        participants: new mongoose.Types.ObjectId(userId),
      })
      .populate("host", "name email _id")
      .populate("participants", "name email avatar _id");

    if (!projects || projects.length === 0) {
      return [];
    }

    return projects;
  } catch (error) {
    console.error("Error in getAllProjectsWithMembers:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Adds a new member to a project using their email address.
 * @param projectId - The ID of the project.
 * @param email - The email of the user to add.
 * @returns Updated project information or error message.
 */
export const addMemberToProject = async (projectId: string, email: string) => {
  try {
    const project = await projectModel.findById(projectId);
    if (!project) {
      return { status: 404, message: "Project not found" };
    }

    const user = await userModel.findOne({ email }).select("-password");

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    const newProject = await projectModel
      .findByIdAndUpdate(
        projectId,
        { $addToSet: { participants: new mongoose.Types.ObjectId(user._id) } },
        { new: true },
      )
      .populate("participants", "name email _id avatar");

    return {
      status: 200,
      message: "Member added successfully",
      project: newProject,
      user: user,
    };
  } catch (error) {
    console.error("Error in addMemberToProject:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/** Removes a member from a project and updates related tasks and meetings.
 * @param projectId - The ID of the project.
 * @param memberId - The ID of the member to remove.
 * @returns Updated project information or error message.
 */
export const removeMemberFromProject = async (
  projectId: string,
  memberId: string,
) => {
  try {
    const result = await projectModel.findByIdAndUpdate(
      { _id: projectId },
      { $pull: { participants: new mongoose.Types.ObjectId(memberId) } },
      { new: true },
    );

    if (!result) {
      return { status: 404, message: "Project not found" };
    }

    await taskModel.updateMany(
      { project: projectId },
      { $pull: { userIds: new mongoose.Types.ObjectId(memberId) } },
    );

    await meetingModel.updateMany(
      { projectId: projectId },
      { $pull: { participants: new mongoose.Types.ObjectId(memberId) } },
    );

    return {
      status: 200,
      message: "Member removed successfully",
      project: result,
    };
  } catch (error) {
    console.error("Error in removeMemberFromProject:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Retrieves all projects associated with a specific user, including host and participant details.
 * @param userId - The ID of the user whose projects are to be fetched.
 * @param title - The title of the new project.
 * @param color - The color associated with the new project.
 * @returns new project.
 */
export const createProject = async (
  userId: string,
  description: string,
  title: string,
  color: string,
) => {
  try {
    const project = await new projectModel({
      title: title,
      description: description,
      color: color,
      host: new mongoose.Types.ObjectId(userId),
      participants: [new mongoose.Types.ObjectId(userId)],
    }).save();

    await project.populate("host", "name email _id");
    await project.populate("participants", "name email avatar _id");

    return { message: "Create project successfully", project: project };
  } catch (error) {
    console.error("Error in createProject:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Updates project details including title, name, and participants.
 * @param projectId - The ID of the project to update.
 * @param title - The new title for the project.
 * @param participants - The updated list of participants.
 * @returns The updated project information or an error message.
 */
export const updateProject = async (
  projectId: string,
  title: string,
  description: string,
  participants: [string],
) => {
  try {
    const project = await projectModel.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        participants: participants.map((id) => new mongoose.Types.ObjectId(id)),
      },
      { new: true },
    );
    if (!project) {
      return { status: 404, message: "Project not found" };
    }
    return { status: 200, project: project };
  } catch (error) {
    console.error("Error in updateProject:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Deletes project details by ID.
 * @param projectId - The ID of the project to delete.
 * @returns The project id or an error message.
 */
export const deleteProject = async (projectId: string) => {
  try {
    const result = await projectModel.findByIdAndDelete(projectId);
    if (!result) {
      return { status: 404, message: "Project not found" };
    }

    await taskModel.deleteMany({ project: projectId });
    await meetingModel.deleteMany({ projectId: projectId });
    await chatModel.deleteMany({ projectId: projectId });

    return {
      status: 200,
      message: "Project deleted successfully",
      projectId: projectId,
    };
  } catch (error) {
    console.error("Error in deleteProject:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

// Task services
/**
 * Retrieve all tasks belonging to a specific project.
 * @param projectId - The unique identifier of the project.
 * @returns Object containing status code and an array of tasks.
 */
export const getProjectTasks = async (projectId: string) => {
  try {
    const tasks = await taskModel
      .find({ project: new mongoose.Types.ObjectId(projectId) })
      .populate("userIds", "name email _id")
      .populate("project", "title description _id");
    return { status: 200, tasks };
  } catch (error) {
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Create a new task under a given project.
 * @param userIds - Array of user IDs assigned to the task.
 * @param project - The project ID to which this task belongs.
 * @param title - The title of the task.
 * @param description - Description or notes about the task.
 * @param startDay - Start date in UNIX timestamp (seconds).
 * @param dueDay - Due date in UNIX timestamp (seconds).
 * @param types - Optional list of task tags or categories.
 * @returns Object containing status code and created task.
 */
export const createTask = async (
  userIds: [string],
  project: string,
  title: string,
  description: string,
  startDay: number,
  dueDay: number,
  types?: [string],
) => {
  try {
    const newUserIds = userIds.map((id) => new mongoose.Types.ObjectId(id));
    let task = await new taskModel({
      userIds: newUserIds,
      project: new mongoose.Types.ObjectId(project),
      title: title,
      description: description,
      startDay: startDay,
      dueDay: dueDay,
      types: types || [],
    }).save();

    await task.populate("userIds", "name email _id");

    return { status: 201, task };
  } catch (error) {
    console.error("Error in createTask:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Update an existing task by its ID.
 * Supports updating title, assigned users, timeline, and status.
 * @param taskId - Task identifier.
 * @param userIds - Optional array of assigned user IDs.
 * @param title - Optional updated title.
 * @param description - Optional updated description.
 * @param startDay - Optional new start date.
 * @param dueDay - Optional new due date.
 * @param types - Optional list of task categories.
 * @param status - Optional numeric status code.
 * @returns Updated task document or not found message.
 */
export const updateTask = async (
  taskId: string,
  userIds?: [string],
  title?: string,
  description?: string,
  startDay?: number,
  dueDay?: number,
  types?: [string],
  status?: number,
) => {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      {
        userIds: userIds?.map((id) => new mongoose.Types.ObjectId(id)),
        title: title,
        description: description,
        startDay: startDay,
        dueDay: dueDay,
        types: types || [],
        status: status,
      },
      { new: true },
    );
    if (!updatedTask) {
      return { status: 404, message: "Task not found" };
    }
    return { status: 200, task: updatedTask };
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Update only the status of a specific task.
 * @param taskId - Task identifier.
 * @param status - New numeric status code.
 * @returns Updated task document or 404 if not found.
 */
export const updateTaskStatus = async (taskId: string, status: number) => {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { status: status },
      { new: true },
    );

    if (!updatedTask) {
      return { status: 404, message: "Task not found" };
    }
    return { status: 200, task: updatedTask };
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Delete a task permanently by ID.
 * @param taskId - The unique identifier of the task to delete.
 * @returns Success or not-found message with corresponding status.
 */
export const deleteTask = async (taskId: string) => {
  try {
    const result = await taskModel.deleteOne({ _id: taskId });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Task not found" };
    }
    return {
      status: 200,
      message: "Task deleted successfully",
      taskId: taskId,
    };
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

//Meeting services
/**
 * Get all meetings a specific user is participating in.
 * @param userId - User identifier.
 * @returns Array of meeting documents.
 */
export const getProjectMeetingsByUserId = async (userId: string) => {
  try {
    const meetings = await meetingModel
      .find({
        participants: new mongoose.Types.ObjectId(userId),
      })
      .populate("participants", "name email avatar _id");

    return { status: 200, meetings };
  } catch (error) {
    console.error("Error in getProjectMeetings:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Retrieve all meetings for a specific project.
 * @param projectId - The unique identifier of the project.
 * @returns Array of meeting documents with participant details.
 */
export const getProjectMeetings = async (projectId: string) => {
  try {
    const meetings = await meetingModel
      .find({
        projectId: new mongoose.Types.ObjectId(projectId),
      })
      .populate("participants", "name email avatar _id");

    return { status: 200, meetings };
  } catch (error) {
    console.error("Error in getProjectMeetings:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Create a new meeting and assign participants.
 * @param projectId - Project ID for which the meeting is created.
 * @param title - Meeting title.
 * @param startTime - Start time in UNIX timestamp (seconds).
 * @param endTime - End time in UNIX timestamp (seconds).
 * @param participants - List of user IDs invited to the meeting.
 * @param userId - The ID of the host user.
 * @returns Newly created meeting document.
 */
export const createMeeting = async (
  projectId: string,
  title: string,
  startTime: number,
  endTime: number,
  participants: [string],
  userId: string,
) => {
  try {
    const newMeeting = await new meetingModel({
      projectId: new mongoose.Types.ObjectId(projectId),
      title: title,
      startTime: startTime,
      endTime: endTime,
      participants: participants.map((id) => new mongoose.Types.ObjectId(id)),
      host: new mongoose.Types.ObjectId(userId),
    }).save();

    await newMeeting.populate("participants", "name email avatar _id");

    const date = new Date(startTime * 1000);

    // schedule.scheduleJob(date, scheduledMeetingStart.);

    return { status: 201, meeting: newMeeting };
  } catch (error) {
    console.error("Error in createMeeting:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

export const scheduledMeetingStart = async (meetingId: string) => {
  try {
    return true;
  } catch (error) {
    console.error("Error in scheduledMeetingStart:", error);
  }
};

/**
 * Update an existing meeting’s details such as title, time, or participants.
 * @param meetingId - Meeting identifier.
 * @param updateData - Object containing fields to update.
 * @returns Updated meeting document or error if not found.
 */
export const updateMeeting = async (meetingId: string, updateData: any) => {
  try {
    const updatedMeeting = await meetingModel
      .findByIdAndUpdate(meetingId, updateData, { new: true })
      .populate("participants", "name email avatar _id");

    if (!updatedMeeting) {
      return { status: 404, message: "Meeting not found" };
    }

    return { status: 200, meeting: updatedMeeting };
  } catch (error) {
    console.error("Error in updateMeeting:", error);
    throw { status: 500, message: "Internal server error" };
  }
};

/**
 * Delete a meeting permanently by ID.
 * @param meetingId - The unique identifier of the meeting to delete.
 * @returns Success or not-found message with corresponding status.
 */
export const deleteMeeting = async (meetingId: string) => {
  try {
    const result = await meetingModel.deleteOne({ _id: meetingId });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Meeting not found" };
    }
    return {
      status: 200,
      message: "Meeting deleted successfully",
      meetingId: meetingId,
    };
  } catch (error) {
    console.error("Error in deleteMeeting:", error);
    throw { status: 500, message: "Internal server error" };
  }
};
