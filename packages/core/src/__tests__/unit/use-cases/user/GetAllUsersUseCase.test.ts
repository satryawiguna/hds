import { GetAllUsersUseCase } from "../../../../use-cases/user/GetAllUsersUseCase";
import { IUserRepository, IProfileRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";
import { Profile } from "../../../../entities/user/Profile";

describe("GetAllUsersUseCase", () => {
  let getAllUsersUseCase: GetAllUsersUseCase;
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

    getAllUsersUseCase = new GetAllUsersUseCase(
      mockUserRepository,
      mockProfileRepository
    );
  });

  describe("execute", () => {
    it("should return all users with profiles", async () => {
      const users = [
        new User(
          "user-1",
          "user1@example.com",
          "hashedPassword",
          true,
          null,
          new Date(),
          null,
          null,
          null,
          new Date(),
          new Date()
        ),
        new User(
          "user-2",
          "user2@example.com",
          "hashedPassword",
          true,
          null,
          new Date(),
          null,
          null,
          null,
          new Date(),
          new Date()
        ),
      ];

      const profile1 = new Profile(
        "profile-1",
        "user-1",
        "John",
        "Doe",
        null,
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockUserRepository.findAll.mockResolvedValue({ users, total: 2 });
      mockProfileRepository.findByUserId.mockImplementation((userId) => {
        if (userId === "user-1") return Promise.resolve(profile1);
        return Promise.resolve(null);
      });

      const result = await getAllUsersUseCase.execute();

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.users[0].user.id).toBe("user-1");
      expect(result.users[0].profile).toEqual(profile1);
      expect(result.users[1].profile).toBeNull();
    });

    it("should support pagination", async () => {
      const users = [
        new User(
          "user-1",
          "user1@example.com",
          "hashedPassword",
          true,
          null,
          new Date(),
          null,
          null,
          null,
          new Date(),
          new Date()
        ),
      ];

      mockUserRepository.findAll.mockResolvedValue({ users, total: 10 });
      mockProfileRepository.findByUserId.mockResolvedValue(null);

      const result = await getAllUsersUseCase.execute(1, 5);

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(1, 5);
      expect(result.total).toBe(10);
    });
  });
});
