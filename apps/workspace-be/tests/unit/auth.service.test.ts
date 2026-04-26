//mock models
jest.mock("../../src/Models/user.model", () => {
  const MockUserModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  (MockUserModel as any).findOne = jest.fn();
  return { __esModule: true, default: MockUserModel };
});

jest.mock("../../src/Models/setting.model", () => {
  const MockSettingModel = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  return { __esModule: true, default: MockSettingModel };
});

import settingModel from "../../src/Models/setting.model.js";
import userModel from "../../src/Models/user.model.js";
import {
  synceUserOnFirstLogin,
  signout,
} from "../../src/Services/auth.service.js";

const mockUserModel = userModel as any;
const mockSettingModel = settingModel as any;

global.fetch = jest.fn();

describe("synceUserOnFirstLogin", () => {
  const mockKeycloakUser = {
    sub: "kc-123",
    email: "test@example.com",
    preferred_username: "testuser",
    given_name: "John",
    family_name: "Doe",
  };

  beforeEach(() => jest.clearAllMocks());

  it("should return existing user if already registered", async () => {
    const existingUser = { _id: "user-1", email: "test@example.com" };
    mockUserModel.findOne.mockResolvedValue(existingUser);

    const result = await synceUserOnFirstLogin(mockKeycloakUser);

    expect(result.status).toBe(200);
    expect(result.data).toEqual(existingUser);
    expect(result.message).toBe("Login successful");
  });

  it("should create new user if not registerd", async () => {
    const mockSetting = { _id: "setting-1" };
    const mockNewUser = { _id: "user-new", email: "test@example.com" };
    mockUserModel.findOne.mockResolvedValue(null);

    mockSettingModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSetting),
    }));

    mockUserModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockNewUser),
    }));

    const result = await synceUserOnFirstLogin(mockKeycloakUser);

    expect(result.status).toBe(201);
    expect(result.data).toEqual(mockNewUser);
  });

  it("should use preferred_username if given_name is missing", async () => {
    const mockSetting = { _id: "setting-1" };
    const userWithoutName = {
      sub: "kc-456",
      email: "noname@example.com",
      preferred_username: "fallback_username",
    };

    mockUserModel.findOne.mockResolvedValue(null);

    mockSettingModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockSetting),
    }));

    let capturedArgs: any;
    mockUserModel.mockImplementation((args: any) => {
      capturedArgs = args;
      return { save: jest.fn().mockResolvedValue({ _id: "u1", ...args }) };
    });

    await synceUserOnFirstLogin(userWithoutName);

    expect(capturedArgs.name).toBe("fallback_username");
  });
});

describe("signout", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call Keycloak logout endpoint and return 200", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const result = await signout("Bearer valid-token");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("logout"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(result.status).toBe(200);
  });

  it("should throw error if Keycloak logout fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(signout("Bearer bad-token")).rejects.toMatchObject({
      status: 500,
    });
  });
});
