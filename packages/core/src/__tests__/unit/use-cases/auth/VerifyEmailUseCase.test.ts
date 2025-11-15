import { VerifyEmailUseCase } from "../../../../use-cases/auth/VerifyEmailUseCase";
import { IUserRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("VerifyEmailUseCase", () => {
  let verifyEmailUseCase: VerifyEmailUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

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

    verifyEmailUseCase = new VerifyEmailUseCase(mockUserRepository);
  });

  describe("execute", () => {
    it("should verify email successfully", async () => {
      const user = new User(
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

      mockUserRepository.findByEmailVerificationToken.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);

      await verifyEmailUseCase.execute("verification-token");

      expect(
        mockUserRepository.findByEmailVerificationToken
      ).toHaveBeenCalledWith("verification-token");
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          isActive: true,
          emailVerificationToken: null,
        })
      );
    });

    it("should throw NotFoundError for invalid token", async () => {
      mockUserRepository.findByEmailVerificationToken.mockResolvedValue(null);

      await expect(verifyEmailUseCase.execute("invalid-token")).rejects.toThrow(
        "Invalid or expired verification token"
      );
    });
  });
});
