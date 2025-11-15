import { RegisterUseCase } from "../../../../use-cases/auth/RegisterUseCase";
import { User, Profile } from "../../../../entities";
import {
  IUserRepository,
  IProfileRepository,
  IPasswordHashService,
  ITokenService,
  IEmailService,
} from "../../../../interfaces";

describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;
  let mockPasswordHashService: jest.Mocked<IPasswordHashService>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockEmailService: jest.Mocked<IEmailService>;

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

    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    registerUseCase = new RegisterUseCase(
      mockUserRepository,
      mockProfileRepository,
      mockPasswordHashService,
      mockTokenService,
      mockEmailService
    );
  });

  describe("execute", () => {
    const validInput = {
      email: "test@example.com",
      password: "Password123!",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1234567890",
      address: "123 Main St",
      avatar: "https://example.com/avatar.jpg",
      dateOfBirth: new Date("1990-01-01"),
    };

    it("should register a new user successfully", async () => {
      const hashedPassword = "hashedPassword123";
      const verificationToken = "verificationToken123";

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHashService.hash.mockResolvedValue(hashedPassword);
      mockTokenService.generateEmailVerificationToken.mockReturnValue(
        verificationToken
      );
      mockUserRepository.create.mockImplementation(async (user) => user);
      mockProfileRepository.create.mockImplementation(
        async (profile) => profile
      );
      mockEmailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await registerUseCase.execute(validInput);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email
      );
      expect(mockPasswordHashService.hash).toHaveBeenCalledWith(
        validInput.password
      );
      expect(
        mockTokenService.generateEmailVerificationToken
      ).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockProfileRepository.create).toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        validInput.email,
        verificationToken
      );

      expect(result.user).toBeInstanceOf(User);
      expect(result.user.email).toBe(validInput.email);
      expect(result.user.password).toBe(hashedPassword);
      expect(result.profile).toBeInstanceOf(Profile);
      expect(result.profile.firstName).toBe(validInput.firstName);
      expect(result.profile.lastName).toBe(validInput.lastName);
    });

    it("should throw ConflictError if email already exists", async () => {
      const existingUser = new User(
        "existing-id",
        validInput.email,
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

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(registerUseCase.execute(validInput)).rejects.toThrow(
        "Email already registered"
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email
      );
      expect(mockPasswordHashService.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("should create user with default values when optional fields are not provided", async () => {
      const minimalInput = {
        email: "test@example.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
      };

      const hashedPassword = "hashedPassword123";
      const verificationToken = "verificationToken123";

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHashService.hash.mockResolvedValue(hashedPassword);
      mockTokenService.generateEmailVerificationToken.mockReturnValue(
        verificationToken
      );
      mockUserRepository.create.mockImplementation(async (user) => user);
      mockProfileRepository.create.mockImplementation(
        async (profile) => profile
      );
      mockEmailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await registerUseCase.execute(minimalInput);

      expect(result.profile.phoneNumber).toBeNull();
      expect(result.profile.address).toBeNull();
      expect(result.profile.avatar).toBeNull();
      expect(result.profile.dateOfBirth).toBeNull();
    });
  });
});
