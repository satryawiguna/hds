import { ForgotPasswordUseCase } from "../../../../use-cases/auth/ForgotPasswordUseCase";
import {
  IUserRepository,
  ITokenService,
  IEmailService,
} from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("ForgotPasswordUseCase", () => {
  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockEmailService: jest.Mocked<IEmailService>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByRefreshToken: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      findByPasswordResetToken: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      generateEmailVerificationToken: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    forgotPasswordUseCase = new ForgotPasswordUseCase(
      mockUserRepository,
      mockTokenService,
      mockEmailService
    );
  });

  describe("execute", () => {
    it("should send password reset email successfully", async () => {
      const user = new User(
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

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockTokenService.generatePasswordResetToken.mockReturnValue(
        "reset-token-123"
      );
      mockUserRepository.update.mockResolvedValue(user);
      mockEmailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await forgotPasswordUseCase.execute("test@example.com");

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockTokenService.generatePasswordResetToken).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        "test@example.com",
        "reset-token-123"
      );
    });

    it("should not throw error when user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        forgotPasswordUseCase.execute("nonexistent@example.com")
      ).resolves.toBeUndefined();

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(
        mockTokenService.generatePasswordResetToken
      ).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });
});
