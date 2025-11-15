import { Request, Response, NextFunction } from "express";
import { User, Profile } from "@hds/core";
import { AuthRequest } from "../../../../../middlewares/auth.middleware";

const mockRegisterExecute = jest.fn();
const mockLoginExecute = jest.fn();
const mockLogoutExecute = jest.fn();

jest.mock("@hds/core", () => ({
  ...jest.requireActual("@hds/core"),
  RegisterUseCase: jest.fn().mockImplementation(() => ({
    execute: mockRegisterExecute,
  })),
  LoginUseCase: jest.fn().mockImplementation(() => ({
    execute: mockLoginExecute,
  })),
  LogoutUseCase: jest.fn().mockImplementation(() => ({
    execute: mockLogoutExecute,
  })),
  RefreshTokenUseCase: jest.fn(),
  VerifyEmailUseCase: jest.fn(),
  ForgotPasswordUseCase: jest.fn(),
  ResetPasswordUseCase: jest.fn(),
}));

jest.mock("../../../../../config/database.config", () => ({
  db: {},
}));

jest.mock("../../../../../config/env.config", () => ({
  env: { jwtSecret: "test-secret" },
}));

jest.mock("@hds/infrastructure", () => ({
  UserRepository: jest.fn(),
  ProfileRepository: jest.fn(),
  PasswordHashService: jest.fn(),
  TokenService: jest.fn(),
  EmailService: jest.fn(),
}));

jest.mock("@hds/shared", () => ({
  ...jest.requireActual("@hds/shared"),
  registerSchema: {
    validate: jest.fn((data) => Promise.resolve(data)),
  },
  loginSchema: {
    validate: jest.fn((data) => Promise.resolve(data)),
  },
}));

import { AuthController } from "../../../../../modules/auth/controllers/auth.controller";

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    authController = new AuthController();

    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
    mockRegisterExecute.mockReset();
    mockLoginExecute.mockReset();
    mockLogoutExecute.mockReset();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        false,
        "verification-token",
        null,
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
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      };

      mockRegisterExecute.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
      });

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            user: expect.objectContaining({
              id: mockUser.id,
              email: mockUser.email,
            }),
            profile: expect.objectContaining({
              firstName: mockProfile.firstName,
              lastName: mockProfile.lastName,
            }),
          }),
        })
      );
    });

    it("should handle validation errors", async () => {
      mockRequest.body = {
        email: "invalid-email",
        password: "123",
      };

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockUser = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        "refresh-token-123",
        new Date(),
        new Date()
      );

      const mockProfile = new Profile(
        "profile-123",
        "user-123",
        "John",
        "Doe",
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123!",
      };

      mockLoginExecute.mockResolvedValue({
        user: mockUser,
        profile: mockProfile,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            user: expect.any(Object),
            tokens: expect.objectContaining({
              accessToken: "access-token",
              refreshToken: "refresh-token",
            }),
          }),
        })
      );
    });

    it("should call next with error on login failure", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "WrongPassword",
      };

      const error = new Error("Invalid credentials");

      mockLoginExecute.mockRejectedValue(error);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("logout", () => {
    it("should logout user successfully", async () => {
      const authRequest = {
        ...mockRequest,
        user: { id: "user-123", email: "test@example.com" },
      } as AuthRequest;

      mockLogoutExecute.mockResolvedValue(undefined);

      await authController.logout(
        authRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Logout successful",
        })
      );
    });

    it("should handle logout without authenticated user", async () => {
      await authController.logout(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
