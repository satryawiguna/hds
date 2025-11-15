import { LogoutUseCase } from "../../../../use-cases/auth/LogoutUseCase";
import { IUserRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("LogoutUseCase", () => {
  let logoutUseCase: LogoutUseCase;
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

    logoutUseCase = new LogoutUseCase(mockUserRepository);
  });

  describe("execute", () => {
    it("should clear refresh token on successful logout", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        "refresh-token",
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);

      await logoutUseCase.execute("user-123");

      expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          refreshToken: null,
        })
      );
    });

    it("should handle logout when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await logoutUseCase.execute("non-existent-id");

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        "non-existent-id"
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
