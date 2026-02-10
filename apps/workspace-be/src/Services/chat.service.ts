import type { Server, Socket } from "socket.io";
import chatModel from "../Models/chat.model.js";

/**
 * Global in-memory state tracking all active users.
 * Each user is represented by an object containing their socket ID, name, and room.
 */
const usersState = {
  users: [] as any[],
  /**
   * Updates the list of active users.
   * @param newUsersArray - The new array of active user objects.
   */
  setUsers(newUsersArray: any[]) {
    this.users = newUsersArray;
  },
};

/**
 * Registers all Socket.IO event listeners related to chat functionality.
 * @param io - The main Socket.IO server instance.
 */
export function registerChatHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    /**
     * Handles when a user joins a room.
     * Removes them from their previous room (if any),
     * updates the active user list, and broadcasts the new list to all members.
     */
    socket.on("enterRoom", ({ name, room }) => {
      const prevRoom = getUser(socket.id)?.room;

      if (prevRoom) {
        socket.leave(prevRoom);
      }

      const user = activateUser(socket.id, name, room);

      // Update user lists for old and new rooms
      if (prevRoom) {
        io.to(prevRoom).emit("userList", {
          users: getUsersInRoom(prevRoom),
        });
      }

      socket.join(user.room);
      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });
    });

    /**
     * Handles user disconnection.
     * Removes the user from the active list and updates room participants.
     */
    socket.on("disconnect", () => {
      const user = getUser(socket.id);
      userLeavesApp(socket.id);

      if (user) {
        io.to(user.room).emit("userList", {
          users: getUsersInRoom(user.room),
        });
      }
    });

    /**
     * Handles new chat messages.
     * Broadcasts the message to the room and saves it to MongoDB.
     */
    socket.on(
      "message",
      ({ userId, projectId, avatar, name, text, createdAt }) => {
        const room = getUser(socket.id)?.room;

        if (room) {
          io.to(room).emit(
            "message",
            buildMsg(userId, projectId, avatar, name, text, createdAt)
          );

          // Persist message to MongoDB
          const chat = new chatModel({
            userId: userId,
            projectId: projectId,
            message: text,
            avatar: avatar,
            name: name,
            createdAt: createdAt,
          });
          chat.save();
        }
      }
    );

    /**
     * Handles "user is typing" activity indication.
     * Broadcasts to all users in the same room except the sender.
     */
    socket.on("activity", (name) => {
      const room = getUser(socket.id)?.room;
      if (room) {
        socket.broadcast.to(room).emit("activity", name);
      }
    });
  });
}

/**
 * Retrieves the most recent chat messages in a given project.
 * @param projectId - The unique project identifier.
 * @returns Promise containing the 50 most recent chat documents.
 */
export function getChatInProject(projectId: string) {
  return chatModel.find({ projectId }).sort({ createdAt: -1 }).limit(50).lean();
}

// Builds a chat message object.
function buildMsg(
  userId = "",
  projectId = "",
  avatar = "",
  name = "",
  text = "",
  createdAt = 0
) {
  return {
    userId: userId,
    projectId: projectId,
    avatar: avatar,
    name: name,
    text: text,
    createdAt: createdAt,
  };
}

/**
 * Adds or updates a user in the active user list.
 * @param id - Socket ID of the user.
 * @param name - Display name.
 * @param room - Room identifier.
 * @returns The activated user object.
 */
function activateUser(id: string, name: string, room: string) {
  const user = { id, name, room };
  usersState.setUsers([...usersState.users.filter((u) => u.id !== id), user]);
  return user;
}

/**
 * Removes a user from the active user list.
 * @param id - Socket ID of the user.
 */
function userLeavesApp(id: string) {
  usersState.setUsers(usersState.users.filter((u) => u.id !== id));
}

/**
 * Retrieves a single user by socket ID.
 * @param id - Socket ID.
 */
function getUser(id: string) {
  return usersState.users.find((u) => u.id === id);
}

/**
 * Retrieves all users currently in a specific room.
 * @param room - Room identifier.
 */
function getUsersInRoom(room: string) {
  return usersState.users.filter((u) => u.room === room);
}
