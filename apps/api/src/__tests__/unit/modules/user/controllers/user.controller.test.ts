import { Request, Response, NextFunction } from "express";
import { User, Profile } from "@hds/core";
import { AuthRequest } from "../../../../../middlewares/auth.middleware";

const mockGetUserByIdExecute = jest.fn();
const mockGetAllUsersExecute = jest.fn();
const mockUpdateUserExecute = jest.fn();
const mockDeleteUserExecute = jest.fn();

const mockUpdateUserValidate = jest.fn();
const mockGetUsersQueryValidate = jest.fn();

jest.mock("@hds/core", () => ({
  ...jest.requireActual("@hds/core"),
  GetUserByIdUseCase: jest.fn().mockImplementation(() => ({
    execute: mockGetUserByIdExecute,
  })),
  GetAllUsersUseCase: jest.fn().mockImplementation(() => ({
    execute: mockGetAllUsersExecute,
  })),
  UpdateUserUseCase: jest.fn().mockImplementation(() => ({
    execute: mockUpdateUserExecute,
  })),
  DeleteUserUseCase: jest.fn().mockImplementation(() => ({
    execute: mockDeleteUserExecute,
  })),
}));

jest.mock("../../../../../config/database.config", () => ({
  db: jest.fn(),
}));

jest.mock("@hds/infrastructure", () => ({
  UserRepository: jest.fn(),
  ProfileRepository: jest.fn(),
}));

jest.mock("@hds/shared", () => ({
  ...jest.requireActual("@hds/shared"),
  updateUserSchema: {
    validate: (...args: any[]) => mockUpdateUserValidate(...args),
  },
  getUsersQuerySchema: {
    validate: (...args: any[]) => mockGetUsersQueryValidate(...args),
  },
}));

import { UserController } from "../../../../../modules/user/controllers/user.controller";

describe("UserController", () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockAuthRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUpdateUserValidate.mockImplementation((data, _options) =>
      Promise.resolve(data)
    );
    mockGetUsersQueryValidate.mockImplementation((data, _options) =>
      Promise.resolve({
        page: data.page ? parseInt(data.page, 10) : undefined,
        limit: data.limit ? parseInt(data.limit, 10) : undefined,
      })
    );

    userController = new UserController();

    mockRequest = {
      params: {},
      query: {},
      body: {},
    };

    mockAuthRequest = {
      ...mockRequest,
      user: {
        id: "user-123",
        email: "test@example.com",
      },
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("getMe", () => {
    it("should return current user profile", async () => {
      const mockUser = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      const mockProfile = new Profile(
        "profile-123",
        "user-123",
        "John",
        "Doe",
        "1234567890",
        "123 Street",
        "avatar.jpg",
        new Date("1990-01-01"),
        new Date(),
        new Date()
      );

      mockGetUserByIdExecute.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
      });

      await userController.getMe(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockGetUserByIdExecute).toHaveBeenCalledWith("user-123");
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: expect.objectContaining({
          id: "user-123",
          email: "test@example.com",
        }),
      });
    });
  });

  describe("getById", () => {
    it("should return user by id", async () => {
      const mockUser = new User(
        "user-456",
        "other@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockGetUserByIdExecute.mockResolvedValue({
        user: mockUser,
        profile: null,
      });

      mockRequest.params = { id: "user-456" };

      await userController.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockGetUserByIdExecute).toHaveBeenCalledWith("user-456");
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: expect.objectContaining({
          id: "user-456",
        }),
      });
    });
  });

  describe("getAll", () => {
    it("should return paginated users list", async () => {
      const mockUser = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockGetAllUsersExecute.mockResolvedValue({
        users: [{ user: mockUser, profile: null }],
        total: 1,
      });

      mockRequest.query = { page: "1", limit: "10" };

      await userController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockGetAllUsersExecute).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const mockUser = new User(
        "user-123",
        "updated@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUpdateUserExecute.mockResolvedValue({
        user: mockUser,
        profile: null,
      });

      mockRequest.params = { id: "user-123" };
      mockRequest.body = { email: "updated@example.com" };

      await userController.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockUpdateUserExecute).toHaveBeenCalledWith("user-123", {
        email: "updated@example.com",
      });
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      mockDeleteUserExecute.mockResolvedValue(undefined);

      mockRequest.params = { id: "user-123" };

      await userController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockDeleteUserExecute).toHaveBeenCalledWith("user-123");
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: null,
        message: "User deleted successfully",
      });
    });
  });

  describe("error handling", () => {
    it("should call next with error when getMe fails", async () => {
      const error = new Error("Database error");
      mockGetUserByIdExecute.mockRejectedValue(error);

      await userController.getMe(
        mockAuthRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
