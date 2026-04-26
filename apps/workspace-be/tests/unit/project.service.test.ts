jest.mock("../../src/Models/project.model.ts", () => {
  const MockProjectModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    populate: jest.fn(),
  }));
  (MockProjectModel as any).find = jest.fn();
  (MockProjectModel as any).findById = jest.fn();
  (MockProjectModel as any).findByIdAndUpdate = jest.fn();
  (MockProjectModel as any).findByIdAndDelete = jest.fn();
  return { __esModule: true, default: MockProjectModel };
});

jest.mock("../../src/Models/task.model.ts", () => {
  const MockTaskModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    populate: jest.fn(),
  }));
  (MockTaskModel as any).find = jest.fn();
  (MockTaskModel as any).findByIdAndUpdate = jest.fn();
  (MockTaskModel as any).deleteOne = jest.fn();
  (MockTaskModel as any).deleteMany = jest.fn();
  (MockTaskModel as any).updateMany = jest.fn();
  return { __esModule: true, default: MockTaskModel };
});

jest.mock("../../src/Models/user.model.ts", () => {
  const MockUserModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  (MockUserModel as any).findOne = jest.fn();
  return { __esModule: true, default: MockUserModel };
});

jest.mock("../../src/Models/meeting.model.ts", () => {
  const MockMeetingModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    populate: jest.fn(),
  }));
  (MockMeetingModel as any).find = jest.fn();
  (MockMeetingModel as any).findByIdAndUpdate = jest.fn();
  (MockMeetingModel as any).deleteOne = jest.fn();
  (MockMeetingModel as any).deleteMany = jest.fn();
  (MockMeetingModel as any).updateMany = jest.fn();
  return { __esModule: true, default: MockMeetingModel };
});

jest.mock("../../src/Models/chat.model.ts", () => {
  const MockChatModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  (MockChatModel as any).deleteMany = jest.fn();
  return { __esModule: true, default: MockChatModel };
});

// mock node-schedule và socket để tránh side effects
jest.mock("node-schedule", () => ({ scheduleJob: jest.fn() }));
jest.mock("../../src/utils/socket.ts", () => ({ getIO: jest.fn() }));

import {
  getAllProject,
  addMemberToProject,
  removeMemberFromProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getProjectMeetings,
  getProjectMeetingsByUserId,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../../src/Services/project.service.js";

const mockProjectModel = require("../../src/Models/project.model").default;
const mockTaskModel = require("../../src/Models/task.model").default;
const mockUserModel = require("../../src/Models/user.model").default;
const mockMeetingModel = require("../../src/Models/meeting.model").default;
const mockChatModel = require("../../src/Models/chat.model").default;

beforeEach(() => jest.clearAllMocks());

// PROJECT SERVICES
describe("getAllProject", () => {
  it("should return list of projects for a user", async () => {
    const mockProjects = [{ _id: "p1" }, { _id: "p2" }];
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProjects),
      }),
    });

    const result = await getAllProject("user-123");

    expect(result).toEqual(mockProjects);
    expect(mockProjectModel.find).toHaveBeenCalled();
  });

  it("should return empty array if no projects found", async () => {
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await getAllProject("user-123");
    expect(result).toEqual([]);
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await expect(getAllProject("user-123")).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("addMemberToProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findById.mockResolvedValue(null);

    const result = await addMemberToProject("proj-999", "user@test.com");
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should return 404 if user not found", async () => {
    mockProjectModel.findById.mockResolvedValue({ _id: "proj-1" });
    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const result = await addMemberToProject("proj-1", "notfound@test.com");
    expect(result).toMatchObject({ status: 404, message: "User not found" });
  });

  it("should add member and return 200", async () => {
    const mockUser = { _id: "u1", email: "found@test.com" };
    const mockUpdatedProject = { _id: "proj-1", participants: ["u1"] };

    mockProjectModel.findById.mockResolvedValue({ _id: "proj-1" });
    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    mockProjectModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUpdatedProject),
    });

    const result = await addMemberToProject("proj-1", "found@test.com");

    expect(result.status).toBe(200);
    expect(result.project).toEqual(mockUpdatedProject);
    expect(result.user).toEqual(mockUser);
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.findById.mockRejectedValue(new Error("DB error"));

    await expect(
      addMemberToProject("proj-1", "user@test.com"),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("removeMemberFromProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await removeMemberFromProject("proj-999", "user-1");
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should remove member and cascade update tasks and meetings", async () => {
    const mockResult = { _id: "proj-1", participants: [] };
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockResult);
    mockTaskModel.updateMany.mockResolvedValue({});
    mockMeetingModel.updateMany.mockResolvedValue({});

    const result = await removeMemberFromProject("proj-1", "user-1");

    expect(result.status).toBe(200);
    expect(mockTaskModel.updateMany).toHaveBeenCalledWith(
      { project: "proj-1" },
      expect.any(Object),
    );
    expect(mockMeetingModel.updateMany).toHaveBeenCalledWith(
      { projectId: "proj-1" },
      expect.any(Object),
    );
  });
});

describe("createProject", () => {
  it("should create and return new project", async () => {
    const mockProject = {
      _id: "proj-new",
      title: "New Project",
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockProjectModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockProject),
    }));

    const result = await createProject("user-1", "desc", "New Project", "red");

    expect(result.message).toBe("Create project successfully");
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await expect(
      createProject("user-1", "desc", "Title", "blue"),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateProject("proj-999", "title", "desc", [
      "user-1",
    ] as any);
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should update and return project", async () => {
    const mockProject = { _id: "proj-1", title: "Updated" };
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockProject);

    const result = await updateProject("proj-1", "Updated", "desc", [
      "user-1",
    ] as any);

    expect(result.status).toBe(200);
    expect(result.project).toEqual(mockProject);
  });
});

describe("deleteProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndDelete.mockResolvedValue(null);

    const result = await deleteProject("proj-999");
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should delete project and cascade delete tasks, meetings, chats", async () => {
    mockProjectModel.findByIdAndDelete.mockResolvedValue({ _id: "proj-1" });
    mockTaskModel.deleteMany.mockResolvedValue({});
    mockMeetingModel.deleteMany.mockResolvedValue({});
    mockChatModel.deleteMany.mockResolvedValue({});

    const result = await deleteProject("proj-1");

    expect(result.status).toBe(200);
    expect(result.projectId).toBe("proj-1");

    expect(mockTaskModel.deleteMany).toHaveBeenCalledWith({
      project: "proj-1",
    });
    expect(mockMeetingModel.deleteMany).toHaveBeenCalledWith({
      projectId: "proj-1",
    });
    expect(mockChatModel.deleteMany).toHaveBeenCalledWith({
      projectId: "proj-1",
    });
  });
});

// TASK SERVICES
describe("getProjectTasks", () => {
  it("should return tasks for a project", async () => {
    const mockTasks = [{ _id: "t1" }, { _id: "t2" }];
    mockTaskModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTasks),
      }),
    });

    const result = await getProjectTasks("proj-1");

    expect(result.status).toBe(200);
    expect(result.tasks).toEqual(mockTasks);
  });

  it("should throw 500 on database error", async () => {
    mockTaskModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await expect(getProjectTasks("proj-1")).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("createTask", () => {
  it("should create and return new task", async () => {
    const mockTask = {
      _id: "task-new",
      title: "New Task",
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockTaskModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockTask),
    }));

    const result = await createTask(
      ["user-1"] as any,
      "proj-1",
      "New Task",
      "desc",
      1000,
      2000,
    );

    expect(result.status).toBe(201);
    expect(result.task).toEqual(mockTask);
  });

  it("should throw 500 on database error", async () => {
    mockTaskModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await expect(
      createTask(["user-1"] as any, "proj-1", "Title", "desc", 1000, 2000),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateTask", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateTask("task-999");
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should update and return task", async () => {
    const mockTask = { _id: "task-1", title: "Updated" };
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

    const result = await updateTask("task-1", undefined, "Updated");

    expect(result.status).toBe(200);
    expect(result.task).toEqual(mockTask);
  });
});

describe("updateTaskStatus", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateTaskStatus("task-999", 2);
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should update status and return task", async () => {
    const mockTask = { _id: "task-1", status: 2 };
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

    const result = await updateTaskStatus("task-1", 2);

    expect(result.status).toBe(200);
    expect(result.task).toEqual(mockTask);
    expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "task-1",
      { status: 2 },
      { new: true },
    );
  });
});

describe("deleteTask", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const result = await deleteTask("task-999");
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should delete task and return 200", async () => {
    mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await deleteTask("task-1");

    expect(result.status).toBe(200);
    expect(result.taskId).toBe("task-1");
  });
});

// MEETING SERVICES
describe("getProjectMeetings", () => {
  it("should return meetings for a project", async () => {
    const mockMeetings = [{ _id: "m1" }, { _id: "m2" }];
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeetings),
    });

    const result = await getProjectMeetings("proj-1");

    expect(result.status).toBe(200);
    expect(result.meetings).toEqual(mockMeetings);
  });

  it("should throw 500 on database error", async () => {
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(getProjectMeetings("proj-1")).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("getProjectMeetingsByUserId", () => {
  it("should return meetings for a user", async () => {
    const mockMeetings = [{ _id: "m1" }];
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeetings),
    });

    const result = await getProjectMeetingsByUserId("user-1");

    expect(result.status).toBe(200);
    expect(result.meetings).toEqual(mockMeetings);
  });
});

describe("createMeeting", () => {
  it("should create meeting and schedule job", async () => {
    const schedule = require("node-schedule");
    const mockMeeting = {
      _id: "meeting-new",
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockMeetingModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockMeeting),
    }));

    const result = await createMeeting(
      "proj-1",
      "Sprint Review",
      1000,
      2000,
      ["user-1"] as any,
      "host-1",
    );

    expect(result.status).toBe(201);
    expect(result.meeting).toEqual(mockMeeting);
    expect(schedule.scheduleJob).toHaveBeenCalled();
  });

  it("should throw 500 on database error", async () => {
    mockMeetingModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await expect(
      createMeeting("proj-1", "title", 1000, 2000, ["u1"] as any, "host-1"),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateMeeting", () => {
  it("should return 404 if meeting not found", async () => {
    mockMeetingModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const result = await updateMeeting("meeting-999", { title: "New" });
    expect(result).toMatchObject({ status: 404, message: "Meeting not found" });
  });

  it("should update and return meeting", async () => {
    const mockMeeting = { _id: "meeting-1", title: "Updated" };
    mockMeetingModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeeting),
    });

    const result = await updateMeeting("meeting-1", { title: "Updated" });

    expect(result.status).toBe(200);
    expect(result.meeting).toEqual(mockMeeting);
  });
});

describe("deleteMeeting", () => {
  it("should return 404 if meeting not found", async () => {
    mockMeetingModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const result = await deleteMeeting("meeting-999");
    expect(result).toMatchObject({ status: 404, message: "Meeting not found" });
  });

  it("should delete meeting and return 200", async () => {
    mockMeetingModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await deleteMeeting("meeting-1");

    expect(result.status).toBe(200);
    expect(result.meetingId).toBe("meeting-1");
  });
});
