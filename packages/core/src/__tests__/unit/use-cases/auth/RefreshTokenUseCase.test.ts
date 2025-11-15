import { RefreshTokenUseCase } from "../../../../use-cases/auth/RefreshTokenUseCase";
import { IUserRepository, ITokenService } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("RefreshTokenUseCase", () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: jest.Mocked<ITokenService>;

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
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      generateEmailVerificationToken: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      verifyEmailVerificationToken: jest.fn(),
      verifyPasswordResetToken: jest.fn(),
    } as jest.Mocked<ITokenService>;
    refreshTokenUseCase = new RefreshTokenUseCase(
      mockUserRepository,
      mockTokenService
    );
  });

  describe("execute", () => {
    it("should refresh tokens successfully", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        "old-refresh-token",
        new Date(),
        new Date()
      );

      mockTokenService.verifyRefreshToken.mockReturnValue(null as any);
      mockUserRepository.findByRefreshToken.mockResolvedValue(user);
      mockTokenService.generateAccessToken.mockReturnValue("new-access-token");
      mockTokenService.generateRefreshToken.mockReturnValue(
        "new-refresh-token"
      );
      mockUserRepository.update.mockResolvedValue(user);

      const result = await refreshTokenUseCase.execute("old-refresh-token");

      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        "old-refresh-token"
      );
      expect(mockUserRepository.findByRefreshToken).toHaveBeenCalledWith(
        "old-refresh-token"
      );
      expect(result).toEqual({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it("should throw UnauthorizedError for invalid token", async () => {
      mockTokenService.verifyRefreshToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(
        refreshTokenUseCase.execute("invalid-token")
      ).rejects.toThrow("Invalid refresh token");
    });

    it("should throw UnauthorizedError when user not found", async () => {
      mockTokenService.verifyRefreshToken.mockReturnValue(null as any);
      mockUserRepository.findByRefreshToken.mockResolvedValue(null);

      await expect(refreshTokenUseCase.execute("valid-token")).rejects.toThrow(
        "Invalid refresh token"
      );
    });

    it("should throw UnauthorizedError for inactive user", async () => {
      const inactiveUser = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        false,
        null,
        null,
        null,
        null,
        "refresh-token",
        new Date(),
        new Date()
      );

      mockTokenService.verifyRefreshToken.mockReturnValue(null as any);
      mockUserRepository.findByRefreshToken.mockResolvedValue(inactiveUser);

      await expect(
        refreshTokenUseCase.execute("refresh-token")
      ).rejects.toThrow("Invalid refresh token");
    });
  });
});
