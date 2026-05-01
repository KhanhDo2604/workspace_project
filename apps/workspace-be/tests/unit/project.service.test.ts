const VALID_IDS = {
  project: "65f1a2b3c4d5e6f7a8b9c0d1",
  project2: "65f1a2b3c4d5e6f7a8b9c0d2",
  user: "65f1a2b3c4d5e6f7a8b9c0d3",
  user2: "65f1a2b3c4d5e6f7a8b9c0d4",
  task: "65f1a2b3c4d5e6f7a8b9c0d5",
  task2: "65f1a2b3c4d5e6f7a8b9c0d6",
  meeting: "65f1a2b3c4d5e6f7a8b9c0d7",
  meeting2: "65f1a2b3c4d5e6f7a8b9c0d8",
};

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

// mock node-schedule and socket to avoid side effects
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
    const mockProjects = [
      { _id: VALID_IDS.project },
      { _id: VALID_IDS.project2 },
    ];
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockProjects),
      }),
    });

    const result = await getAllProject(VALID_IDS.user);

    expect(result).toEqual(mockProjects);
    expect(mockProjectModel.find).toHaveBeenCalled();
  });

  it("should return empty array if no projects found", async () => {
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await getAllProject(VALID_IDS.user);
    expect(result).toEqual([]);
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await expect(getAllProject(VALID_IDS.user)).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("addMemberToProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findById.mockResolvedValue(null);

    const result = await addMemberToProject(VALID_IDS.project, "user@test.com");
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should return 404 if user not found", async () => {
    mockProjectModel.findById.mockResolvedValue({ _id: VALID_IDS.project });
    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const result = await addMemberToProject(
      VALID_IDS.project,
      "notfound@test.com",
    );
    expect(result).toMatchObject({ status: 404, message: "User not found" });
  });

  it("should add member and return 200", async () => {
    const mockUser = { _id: VALID_IDS.user, email: "found@test.com" };
    const mockUpdatedProject = {
      _id: VALID_IDS.project,
      participants: [VALID_IDS.user],
    };

    mockProjectModel.findById.mockResolvedValue({ _id: VALID_IDS.project });
    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });
    mockProjectModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockUpdatedProject),
    });

    const result = await addMemberToProject(
      VALID_IDS.project,
      "found@test.com",
    );

    expect(result.status).toBe(200);
    expect(result.project).toEqual(mockUpdatedProject);
    expect(result.user).toEqual(mockUser);
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.findById.mockRejectedValue(new Error("DB error"));

    await expect(
      addMemberToProject(VALID_IDS.project, "user@test.com"),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("removeMemberFromProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await removeMemberFromProject(
      VALID_IDS.project,
      VALID_IDS.user,
    );
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should remove member and cascade update tasks and meetings", async () => {
    const mockResult = { _id: VALID_IDS.project, participants: [] };
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockResult);
    mockTaskModel.updateMany.mockResolvedValue({});
    mockMeetingModel.updateMany.mockResolvedValue({});

    const result = await removeMemberFromProject(
      VALID_IDS.project,
      VALID_IDS.user,
    );

    expect(result.status).toBe(200);
    expect(mockTaskModel.updateMany).toHaveBeenCalledWith(
      { project: VALID_IDS.project },
      expect.any(Object),
    );
    expect(mockMeetingModel.updateMany).toHaveBeenCalledWith(
      { projectId: VALID_IDS.project },
      expect.any(Object),
    );
  });
});

describe("createProject", () => {
  it("should create and return new project", async () => {
    const mockProject = {
      _id: VALID_IDS.project,
      title: "New Project",
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockProjectModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockProject),
    }));

    const result = await createProject(
      VALID_IDS.user,
      "desc",
      "New Project",
      "red",
    );

    expect(result.message).toBe("Create project successfully");
  });

  it("should throw 500 on database error", async () => {
    mockProjectModel.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    }));

    await expect(
      createProject(VALID_IDS.user, "desc", "Title", "blue"),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateProject(VALID_IDS.project, "title", "desc", [
      VALID_IDS.user,
    ] as any);
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should update and return project", async () => {
    const mockProject = { _id: VALID_IDS.project, title: "Updated" };
    mockProjectModel.findByIdAndUpdate.mockResolvedValue(mockProject);

    const result = await updateProject(VALID_IDS.project, "Updated", "desc", [
      VALID_IDS.user,
    ] as any);

    expect(result.status).toBe(200);
    expect(result.project).toEqual(mockProject);
  });
});

describe("deleteProject", () => {
  it("should return 404 if project not found", async () => {
    mockProjectModel.findByIdAndDelete.mockResolvedValue(null);

    const result = await deleteProject(VALID_IDS.project);
    expect(result).toMatchObject({ status: 404, message: "Project not found" });
  });

  it("should delete project and cascade delete tasks, meetings, chats", async () => {
    mockProjectModel.findByIdAndDelete.mockResolvedValue({
      _id: VALID_IDS.project,
    });
    mockTaskModel.deleteMany.mockResolvedValue({});
    mockMeetingModel.deleteMany.mockResolvedValue({});
    mockChatModel.deleteMany.mockResolvedValue({});

    const result = await deleteProject(VALID_IDS.project);

    expect(result.status).toBe(200);
    expect(result.projectId).toBe(VALID_IDS.project);
    expect(mockTaskModel.deleteMany).toHaveBeenCalledWith({
      project: VALID_IDS.project,
    });
    expect(mockMeetingModel.deleteMany).toHaveBeenCalledWith({
      projectId: VALID_IDS.project,
    });
    expect(mockChatModel.deleteMany).toHaveBeenCalledWith({
      projectId: VALID_IDS.project,
    });
  });
});

// TASK SERVICES
describe("getProjectTasks", () => {
  it("should return tasks for a project", async () => {
    const mockTasks = [{ _id: VALID_IDS.task }, { _id: VALID_IDS.task2 }];
    mockTaskModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTasks),
      }),
    });

    const result = await getProjectTasks(VALID_IDS.project);

    expect(result.status).toBe(200);
    expect(result.tasks).toEqual(mockTasks);
  });

  it("should throw 500 on database error", async () => {
    mockTaskModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await expect(getProjectTasks(VALID_IDS.project)).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("createTask", () => {
  it("should create and return new task", async () => {
    const mockTask = {
      _id: VALID_IDS.task,
      title: "New Task",
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockTaskModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockTask),
    }));

    const result = await createTask(
      [VALID_IDS.user] as any,
      VALID_IDS.project,
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
      createTask(
        [VALID_IDS.user] as any,
        VALID_IDS.project,
        "Title",
        "desc",
        1000,
        2000,
      ),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateTask", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateTask(VALID_IDS.task);
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should update and return task", async () => {
    const mockTask = { _id: VALID_IDS.task, title: "Updated" };
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

    const result = await updateTask(VALID_IDS.task, undefined, "Updated");

    expect(result.status).toBe(200);
    expect(result.task).toEqual(mockTask);
  });
});

describe("updateTaskStatus", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(null);

    const result = await updateTaskStatus(VALID_IDS.task, 2);
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should update status and return task", async () => {
    const mockTask = { _id: VALID_IDS.task, status: 2 };
    mockTaskModel.findByIdAndUpdate.mockResolvedValue(mockTask);

    const result = await updateTaskStatus(VALID_IDS.task, 2);

    expect(result.status).toBe(200);
    expect(result.task).toEqual(mockTask);
    expect(mockTaskModel.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_IDS.task,
      { status: 2 },
      { new: true },
    );
  });
});

describe("deleteTask", () => {
  it("should return 404 if task not found", async () => {
    mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const result = await deleteTask(VALID_IDS.task);
    expect(result).toMatchObject({ status: 404, message: "Task not found" });
  });

  it("should delete task and return 200", async () => {
    mockTaskModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await deleteTask(VALID_IDS.task);

    expect(result.status).toBe(200);
    expect(result.taskId).toBe(VALID_IDS.task);
  });
});

// MEETING SERVICES
describe("getProjectMeetings", () => {
  it("should return meetings for a project", async () => {
    const mockMeetings = [
      { _id: VALID_IDS.meeting },
      { _id: VALID_IDS.meeting2 },
    ];
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeetings),
    });

    const result = await getProjectMeetings(VALID_IDS.project);

    expect(result.status).toBe(200);
    expect(result.meetings).toEqual(mockMeetings);
  });

  it("should throw 500 on database error", async () => {
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(getProjectMeetings(VALID_IDS.project)).rejects.toMatchObject({
      status: 500,
    });
  });
});

describe("getProjectMeetingsByUserId", () => {
  it("should return meetings for a user", async () => {
    const mockMeetings = [{ _id: VALID_IDS.meeting }];
    mockMeetingModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeetings),
    });

    const result = await getProjectMeetingsByUserId(VALID_IDS.user);

    expect(result.status).toBe(200);
    expect(result.meetings).toEqual(mockMeetings);
  });
});

describe("createMeeting", () => {
  it("should create meeting and schedule job", async () => {
    const schedule = require("node-schedule");
    const mockMeeting = {
      _id: VALID_IDS.meeting,
      populate: jest.fn().mockResolvedValue(undefined),
    };

    mockMeetingModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockMeeting),
    }));

    const result = await createMeeting(
      VALID_IDS.project,
      "Sprint Review",
      1000,
      2000,
      [VALID_IDS.user] as any,
      VALID_IDS.user2,
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
      createMeeting(
        VALID_IDS.project,
        "title",
        1000,
        2000,
        [VALID_IDS.user] as any,
        VALID_IDS.user2,
      ),
    ).rejects.toMatchObject({ status: 500 });
  });
});

describe("updateMeeting", () => {
  it("should return 404 if meeting not found", async () => {
    mockMeetingModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const result = await updateMeeting(VALID_IDS.meeting, { title: "New" });
    expect(result).toMatchObject({ status: 404, message: "Meeting not found" });
  });

  it("should update and return meeting", async () => {
    const mockMeeting = { _id: VALID_IDS.meeting, title: "Updated" };
    mockMeetingModel.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockMeeting),
    });

    const result = await updateMeeting(VALID_IDS.meeting, { title: "Updated" });

    expect(result.status).toBe(200);
    expect(result.meeting).toEqual(mockMeeting);
  });
});

describe("deleteMeeting", () => {
  it("should return 404 if meeting not found", async () => {
    mockMeetingModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const result = await deleteMeeting(VALID_IDS.meeting);
    expect(result).toMatchObject({ status: 404, message: "Meeting not found" });
  });

  it("should delete meeting and return 200", async () => {
    mockMeetingModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const result = await deleteMeeting(VALID_IDS.meeting);

    expect(result.status).toBe(200);
    expect(result.meetingId).toBe(VALID_IDS.meeting);
  });
});
