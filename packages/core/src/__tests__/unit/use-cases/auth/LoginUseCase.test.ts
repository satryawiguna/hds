import { LoginUseCase } from "../../../../use-cases/auth/LoginUseCase";
import { User, Profile } from "../../../../entities";
import {
  IUserRepository,
  IProfileRepository,
  IPasswordHashService,
  ITokenService,
} from "../../../../interfaces";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;
  let mockPasswordHashService: jest.Mocked<IPasswordHashService>;
  let mockTokenService: jest.Mocked<ITokenService>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      findByPasswordResetToken: jest.fn(),
      findByRefreshToken: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockProfileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockPasswordHashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    mockTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      generateEmailVerificationToken: jest.fn(),
      generatePasswordResetToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    loginUseCase = new LoginUseCase(
      mockUserRepository,
      mockProfileRepository,
      mockPasswordHashService,
      mockTokenService
    );
  });

  describe("execute", () => {
    const loginInput = {
      email: "test@example.com",
      password: "Password123!",
    };

    const mockUser = new User(
      "user-id-123",
      loginInput.email,
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
      "profile-id-123",
      "user-id-123",
      "John",
      "Doe",
      "+1234567890",
      "123 Main St",
      "https://example.com/avatar.jpg",
      new Date("1990-01-01"),
      new Date(),
      new Date()
    );

    it("should login user successfully with valid credentials", async () => {
      const accessToken = "access-token-123";
      const refreshToken = "refresh-token-123";

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordHashService.compare.mockResolvedValue(true);
      mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);
      mockTokenService.generateAccessToken.mockReturnValue(accessToken);
      mockTokenService.generateRefreshToken.mockReturnValue(refreshToken);
      mockUserRepository.update.mockImplementation(async (user) => user);

      const result = await loginUseCase.execute(loginInput);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        loginInput.email
      );
      expect(mockPasswordHashService.compare).toHaveBeenCalledWith(
        loginInput.password,
        mockUser.password
      );
      expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
      });
      expect(mockUserRepository.update).toHaveBeenCalled();

      expect(result.user).toBe(mockUser);
      expect(result.profile).toBe(mockProfile);
      expect(result.accessToken).toBe(accessToken);
      expect(result.refreshToken).toBe(refreshToken);
    });

    it("should throw UnauthorizedError if user does not exist", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginUseCase.execute(loginInput)).rejects.toThrow(
        "Invalid credentials"
      );
      expect(mockPasswordHashService.compare).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if password is incorrect", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockPasswordHashService.compare.mockResolvedValue(false);

      await expect(loginUseCase.execute(loginInput)).rejects.toThrow(
        "Invalid credentials"
      );
      expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      const unverifiedUser = new User(
        "user-id-123",
        loginInput.email,
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

      mockUserRepository.findByEmail.mockResolvedValue(unverifiedUser);
      mockPasswordHashService.compare.mockResolvedValue(true);

      await expect(loginUseCase.execute(loginInput)).rejects.toThrow(
        "Email not verified"
      );
    });
  });
});
