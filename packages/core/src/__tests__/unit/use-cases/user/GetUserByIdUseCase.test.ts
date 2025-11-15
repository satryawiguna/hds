import { GetUserByIdUseCase } from "../../../../use-cases/user/GetUserByIdUseCase";
import { IUserRepository, IProfileRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";
import { Profile } from "../../../../entities/user/Profile";

describe("GetUserByIdUseCase", () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;

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

    mockProfileRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    getUserByIdUseCase = new GetUserByIdUseCase(
      mockUserRepository,
      mockProfileRepository
    );
  });

  describe("execute", () => {
    it("should return user with profile", async () => {
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
      mockProfileRepository.findByUserId.mockResolvedValue(profile);

      const result = await getUserByIdUseCase.execute("user-123");

      expect(result.user).toEqual(user);
      expect(result.profile).toEqual(profile);
    });

    it("should throw NotFoundError when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(getUserByIdUseCase.execute("non-existent")).rejects.toThrow(
        "User not found"
      );
    });
  });
});
