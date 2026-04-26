jest.mock("../../src/Models/user.model.ts", () => {
  const MockUserModel = jest
    .fn()
    .mockImplementation(() => ({ save: jest.fn() }));

  (MockUserModel as any).findOne = jest.fn();
  return { __esModule: true, default: MockUserModel };
});

import { authMiddleware } from "../../src/middleware/auth.middleware.js";

global.fetch = jest.fn();

describe("", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if no Authorization header", async () => {
    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if Keycloak rejects token", async () => {
    mockReq.headers["authorization"] = "Bearer invalid-token";
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(mockNext).not.toHaveBeenCalled();
  });
  it("should call next() and attach user to req if token is valid", async () => {
    const mockUser = { sub: "kc-123", email: "user@test.com" };
    mockReq.headers["authorization"] = "Bearer valid-token";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual(mockUser);
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should extract token correctly from Authorization header", async () => {
    const mockUser = { sub: "kc-456", email: "another@test.com" };
    mockReq.headers["authorization"] = "Bearer my-secret-token";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    await authMiddleware(mockReq, mockRes, mockNext);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: "Bearer my-secret-token" },
      }),
    );
  });
});
