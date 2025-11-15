import { ResetPasswordUseCase } from "../../../../use-cases/auth/ResetPasswordUseCase";
import { IUserRepository, IPasswordHashService } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("ResetPasswordUseCase", () => {
  let resetPasswordUseCase: ResetPasswordUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordHashService: jest.Mocked<IPasswordHashService>;

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

    mockPasswordHashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    resetPasswordUseCase = new ResetPasswordUseCase(
      mockUserRepository,
      mockPasswordHashService
    );
  });

  describe("execute", () => {
    it("should reset password successfully", async () => {
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

      const user = new User(
        "user-123",
        "test@example.com",
        "oldHashedPassword",
        true,
        null,
        new Date(),
        "reset-token-123",
        resetTokenExpiry,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findByPasswordResetToken.mockResolvedValue(user);
      mockPasswordHashService.hash.mockResolvedValue("newHashedPassword");
      mockUserRepository.update.mockResolvedValue(user);

      await resetPasswordUseCase.execute("reset-token-123", "NewPassword123!");

      expect(mockUserRepository.findByPasswordResetToken).toHaveBeenCalledWith(
        "reset-token-123"
      );
      expect(mockPasswordHashService.hash).toHaveBeenCalledWith(
        "NewPassword123!"
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          passwordResetToken: null,
          passwordResetExpires: null,
        })
      );
    });

    it("should throw NotFoundError for invalid token", async () => {
      mockUserRepository.findByPasswordResetToken.mockResolvedValue(null);

      await expect(
        resetPasswordUseCase.execute("invalid-token", "NewPassword123!")
      ).rejects.toThrow("Invalid or expired password reset token");
    });
  });
});
