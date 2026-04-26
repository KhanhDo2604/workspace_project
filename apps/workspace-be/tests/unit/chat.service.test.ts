jest.mock("../../src/Models/chat.model.ts", () => {
  const MockChatModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  (MockChatModel as any).find = jest.fn();
  return { __esModule: true, default: MockChatModel };
});

import {
  registerChatHandlers,
  getChatInProject,
} from "../../src/Services/chat.service.js";

const mockChatModel = require("../../src/Models/chat.model.ts").default;

// Helper create mock socket and io
function createMockSocket(id: string) {
  const handlers: Record<string, Function> = {};
  return {
    id,
    on: jest.fn((event: string, cb: Function) => {
      handlers[event] = cb;
    }),
    join: jest.fn(),
    leave: jest.fn(),
    broadcast: {
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
    },
    // Helper to trigger connection event
    _trigger: (event: string, ...args: any[]) => handlers[event]?.(...args),
  };
}

function createMockIO() {
  const handlers: Record<string, Function> = {};
  const mockEmit = jest.fn();
  const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

  return {
    on: jest.fn((event: string, cb: Function) => {
      handlers[event] = cb;
    }),
    to: mockTo,
    emit: mockEmit,
    // Helper to trigger connection event
    _triggerConnection: (socket: any) => handlers["connection"]?.(socket),
    _mockTo: mockTo,
    _mockEmit: mockEmit,
  };
}

beforeEach(() => jest.clearAllMocks());

// registerChatHandlers — enterRoom
describe("registerChatHandlers - enterRoom", () => {
  it("should join user to room and emit userList", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Alice", room: "room-A" });

    expect(socket.join).toHaveBeenCalledWith("room-A");
    expect(io.to).toHaveBeenCalledWith("room-A");
    expect(io._mockTo().emit).toHaveBeenCalledWith(
      "userList",
      expect.objectContaining({ users: expect.any(Array) }),
    );
  });

  it("should leave previous room when switching rooms", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Alice", room: "room-A" });
    socket._trigger("enterRoom", { name: "Alice", room: "room-B" });

    expect(socket.leave).toHaveBeenCalledWith("room-A");
    expect(socket.join).toHaveBeenCalledWith("room-B");
  });

  it("should emit userList to old room when switching", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Alice", room: "room-A" });

    // Reset
    io.to.mockClear();

    socket._trigger("enterRoom", { name: "Alice", room: "room-B" });

    // emit userList for room A and B
    const calledRooms = io.to.mock.calls.map((c: any) => c[0]);
    expect(calledRooms).toContain("room-A");
    expect(calledRooms).toContain("room-B");
  });

  it("should include user in userList of new room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Alice", room: "room-A" });

    // get args the final emit
    const emitArgs = io._mockTo().emit.mock.calls.at(-1);
    expect(emitArgs[0]).toBe("userList");
    expect(emitArgs[1].users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Alice", room: "room-A" }),
      ]),
    );
  });
});

// registerChatHandlers — disconnect
describe("registerChatHandlers - disconnect", () => {
  it("should remove user from list and emit updated userList to room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Bob", room: "room-X" });

    io.to.mockClear();
    io._mockTo().emit.mockClear();

    // Trigger disconnect
    socket._trigger("disconnect");

    expect(io.to).toHaveBeenCalledWith("room-X");
    expect(io._mockTo().emit).toHaveBeenCalledWith(
      "userList",
      expect.objectContaining({ users: expect.any(Array) }),
    );
  });

  it("should not emit if user was not in any room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-unknown");
    io._triggerConnection(socket);

    io.to.mockClear();

    socket._trigger("disconnect");

    expect(io.to).not.toHaveBeenCalled();
  });

  it("should remove user from userList after disconnect", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Carol", room: "room-Y" });
    socket._trigger("disconnect");

    const lastEmitArgs = io._mockTo().emit.mock.calls.at(-1);
    const users = lastEmitArgs?.[1]?.users ?? [];
    expect(users.find((u: any) => u.id === "socket-1")).toBeUndefined();
  });
});

// registerChatHandlers — message
describe("registerChatHandlers - message", () => {
  it("should broadcast message to room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Dave", room: "room-A" });
    io.to.mockClear();

    socket._trigger("message", {
      userId: "user-1",
      projectId: "proj-1",
      avatar: "avatar.png",
      name: "Dave",
      text: "Hello!",
      createdAt: 1000,
    });

    expect(io.to).toHaveBeenCalledWith("room-A");
    expect(io._mockTo().emit).toHaveBeenCalledWith(
      "message",
      expect.objectContaining({
        userId: "user-1",
        projectId: "proj-1",
        name: "Dave",
        text: "Hello!",
        createdAt: 1000,
      }),
    );
  });

  it("should save message to MongoDB", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Dave", room: "room-A" });

    socket._trigger("message", {
      userId: "user-1",
      projectId: "proj-1",
      avatar: "avatar.png",
      name: "Dave",
      text: "Hello!",
      createdAt: 1000,
    });

    // chatModel constructor call correct data
    expect(mockChatModel).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        projectId: "proj-1",
        message: "Hello!",
        name: "Dave",
      }),
    );

    const instance = mockChatModel.mock.results.at(-1)?.value;
    expect(instance.save).toHaveBeenCalled();
  });

  it("should not emit or save if user is not in any room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-orphan");
    io._triggerConnection(socket);

    // not join previous room
    io.to.mockClear();
    mockChatModel.mockClear();

    socket._trigger("message", {
      userId: "user-x",
      projectId: "proj-x",
      avatar: "",
      name: "Ghost",
      text: "invisible",
      createdAt: 0,
    });

    expect(io.to).not.toHaveBeenCalled();
    expect(mockChatModel).not.toHaveBeenCalled();
  });
});

// registerChatHandlers — activity
describe("registerChatHandlers - activity", () => {
  it("should broadcast activity to room excluding sender", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-1");
    io._triggerConnection(socket);

    socket._trigger("enterRoom", { name: "Eve", room: "room-Z" });
    socket._trigger("activity", "Eve");

    expect(socket.broadcast.to).toHaveBeenCalledWith("room-Z");
    expect(socket.broadcast.to("room-Z").emit).toHaveBeenCalledWith(
      "activity",
      "Eve",
    );
  });

  it("should not broadcast activity if user not in any room", () => {
    const io = createMockIO() as any;
    registerChatHandlers(io);

    const socket = createMockSocket("socket-orphan");
    io._triggerConnection(socket);

    socket._trigger("activity", "Ghost");

    expect(socket.broadcast.to).not.toHaveBeenCalled();
  });
});

describe("getChatInProject", () => {
  it("should query chatModel with correct projectId and return messages", async () => {
    const mockMessages = [
      { _id: "msg-1", message: "Hello" },
      { _id: "msg-2", message: "World" },
    ];

    mockChatModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockMessages),
        }),
      }),
    });

    const result = await getChatInProject("proj-1");

    expect(mockChatModel.find).toHaveBeenCalledWith({ projectId: "proj-1" });
    expect(result).toEqual(mockMessages);
  });

  it("should sort by createdAt descending and limit to 50", async () => {
    const mockSort = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      }),
    });
    const mockLimit = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue([]),
    });

    mockChatModel.find.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ limit: mockLimit });

    await getChatInProject("proj-1");

    expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(mockLimit).toHaveBeenCalledWith(50);
  });

  it("should return empty array if no messages found", async () => {
    mockChatModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    const result = await getChatInProject("proj-empty");
    expect(result).toEqual([]);
  });
});
