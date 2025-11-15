import { DeleteUserUseCase } from "../../../../use-cases/user/DeleteUserUseCase";
import { IUserRepository } from "../../../../interfaces";
import { User } from "../../../../entities/user/User";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      findByEmailVerificationToken: jest.fn(),
      findByPasswordResetToken: jest.fn(),
      findByRefreshToken: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  describe("execute", () => {
    it("should delete user successfully", async () => {
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
      mockUserRepository.delete.mockResolvedValue();

      await deleteUserUseCase.execute("user-123");

      expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
      expect(mockUserRepository.delete).toHaveBeenCalledWith("user-123");
    });

    it("should throw NotFoundError when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(deleteUserUseCase.execute("non-existent")).rejects.toThrow(
        "User not found"
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });
});
