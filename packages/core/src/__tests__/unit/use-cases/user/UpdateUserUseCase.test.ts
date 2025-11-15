import { UpdateUserUseCase } from "../../../../use-cases/user/UpdateUserUseCase";
import { IUserRepository, IProfileRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";
import { Profile } from "../../../../entities/user/Profile";

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      findByPasswordResetToken: jest.fn(),
      findByRefreshToken: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    mockProfileRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IProfileRepository>;

    updateUserUseCase = new UpdateUserUseCase(
      mockUserRepository,
      mockProfileRepository
    );
  });

  describe("execute", () => {
    it("should update user email", async () => {
      const user = new User(
        "user-123",
        "old@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      const result = await updateUserUseCase.execute("user-123", {
        email: "new@example.com",
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "new@example.com"
      );
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(result.user.email).toBe("new@example.com");
    });

    it("should throw ConflictError when email already in use by another user", async () => {
      const user = new User(
        "user-123",
        "old@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      const existingUser = new User(
        "user-456",
        "new@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(
        updateUserUseCase.execute("user-123", { email: "new@example.com" })
      ).rejects.toThrow("Email already in use");
    });

    it("should allow same email for the same user", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      const result = await updateUserUseCase.execute("user-123", {
        email: "test@example.com",
      });

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(result.user.email).toBe("test@example.com");
    });

    it("should activate user", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        false,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      await updateUserUseCase.execute("user-123", { isActive: true });

      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it("should deactivate user", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      await updateUserUseCase.execute("user-123", { isActive: false });

      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it("should update profile information", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      const profile = new Profile(
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

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(profile);
      mockProfileRepository.update.mockResolvedValue(profile);

      const result = await updateUserUseCase.execute("user-123", {
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "1234567890",
        address: "123 Street",
        avatar: "avatar.jpg",
        dateOfBirth: new Date("1990-01-01"),
      });

      expect(mockProfileRepository.update).toHaveBeenCalled();
      expect(result.profile).not.toBeNull();
    });

    it("should handle null profile gracefully", async () => {
      const user = new User(
        "user-123",
        "test@example.com",
        "hashedPassword",
        true,
        null,
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.update.mockResolvedValue(user);
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      const result = await updateUserUseCase.execute("user-123", {
        firstName: "Jane",
      });

      expect(mockProfileRepository.update).not.toHaveBeenCalled();
      expect(result.profile).toBeNull();
    });

    it("should throw NotFoundError when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        updateUserUseCase.execute("non-existent", { email: "new@example.com" })
      ).rejects.toThrow("User not found");
    });
  });
});
