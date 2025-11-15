import { UserRepository } from "../../../repositories/UserRepository";
import { User } from "@hds/core";
import { Knex } from "knex";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mockDb: jest.Mocked<Knex>;
  let mockQueryBuilder: any;

  beforeEach(() => {
    let countCalled = false;
    mockQueryBuilder = {
      where: jest.fn(function (this: any) {
        return this;
      }),
      first: jest.fn(function (this: any) {
        if (countCalled) {
          countCalled = false;
          return Promise.resolve({ count: 0 });
        }
        return this;
      }),
      orderBy: jest.fn(function (this: any) {
        return this;
      }),
      offset: jest.fn(function (this: any) {
        return this;
      }),
      limit: jest.fn(function (this: any) {
        return this;
      }),
      clone: jest.fn(function (this: any) {
        return this;
      }),
      count: jest.fn(function (this: any) {
        countCalled = true;
        return this;
      }),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockDb = jest.fn(() => mockQueryBuilder) as any;
    mockDb.raw = jest.fn();

    userRepository = new UserRepository(mockDb);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const user = User.create(
        "test@example.com",
        "hashedPassword",
        "token123"
      );
      mockQueryBuilder.insert.mockResolvedValue([1]);

      const result = await userRepository.create(user);

      expect(mockDb).toHaveBeenCalledWith("users");
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          password: user.password,
        })
      );
      expect(result).toBe(user);
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        is_active: true,
        email_verification_token: null,
        email_verified_at: new Date(),
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockUserData);

      const result = await userRepository.findById("user-123");

      expect(mockDb).toHaveBeenCalledWith("users");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: "user-123" });
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockUserData.id);
      expect(result?.email).toBe(mockUserData.email);
    });

    it("should return null if user not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await userRepository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        is_active: true,
        email_verification_token: null,
        email_verified_at: new Date(),
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockUserData);

      const result = await userRepository.findByEmail("test@example.com");

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        email: "test@example.com",
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(mockUserData.email);
    });

    it("should return null if user not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await userRepository.findByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all users without pagination", async () => {
      const mockUsersData = [
        {
          id: "user-1",
          email: "user1@example.com",
          password: "hashedPassword",
          is_active: true,
          email_verification_token: null,
          email_verified_at: new Date(),
          password_reset_token: null,
          password_reset_expires: null,
          refresh_token: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "user-2",
          email: "user2@example.com",
          password: "hashedPassword",
          is_active: true,
          email_verification_token: null,
          email_verified_at: new Date(),
          password_reset_token: null,
          password_reset_expires: null,
          refresh_token: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 2 });
      mockQueryBuilder.orderBy.mockResolvedValue(mockUsersData);

      const result = await userRepository.findAll();

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.users[0]).toBeInstanceOf(User);
    });

    it("should return paginated users", async () => {
      const mockUsersData = [
        {
          id: "user-1",
          email: "user1@example.com",
          password: "hashedPassword",
          is_active: true,
          email_verification_token: null,
          email_verified_at: new Date(),
          password_reset_token: null,
          password_reset_expires: null,
          refresh_token: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({
        count: 10,
      });
      mockQueryBuilder.orderBy.mockResolvedValue(mockUsersData);

      const result = await userRepository.findAll(2, 5);

      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(result.total).toBe(10);
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      const user = new User(
        "user-123",
        "updated@example.com",
        "newHashedPassword",
        true,
        null,
        new Date(),
        null,
        null,
        null,
        new Date(),
        new Date()
      );

      mockQueryBuilder.update.mockResolvedValue(1);

      const result = await userRepository.update(user);

      expect(mockDb).toHaveBeenCalledWith("users");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: user.id });
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          email: user.email,
          password: user.password,
        })
      );
      expect(result).toBe(user);
    });
  });

  describe("delete", () => {
    it("should delete user by id", async () => {
      mockQueryBuilder.delete.mockResolvedValue(1);

      await userRepository.delete("user-123");

      expect(mockDb).toHaveBeenCalledWith("users");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: "user-123" });
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
    });
  });

  describe("findByRefreshToken", () => {
    it("should find user by refresh token", async () => {
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        is_active: true,
        email_verification_token: null,
        email_verified_at: new Date(),
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: "valid-refresh-token",
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockUserData);

      const result = await userRepository.findByRefreshToken(
        "valid-refresh-token"
      );

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        refresh_token: "valid-refresh-token",
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.refreshToken).toBe("valid-refresh-token");
    });

    it("should return null if user not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await userRepository.findByRefreshToken("invalid-token");

      expect(result).toBeNull();
    });
  });

  describe("findByEmailVerificationToken", () => {
    it("should find user by email verification token", async () => {
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        is_active: false,
        email_verification_token: "verification-token",
        email_verified_at: null,
        password_reset_token: null,
        password_reset_expires: null,
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockUserData);

      const result =
        await userRepository.findByEmailVerificationToken("verification-token");

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        email_verification_token: "verification-token",
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.emailVerificationToken).toBe("verification-token");
    });

    it("should return null if user not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result =
        await userRepository.findByEmailVerificationToken("invalid-token");

      expect(result).toBeNull();
    });
  });

  describe("findByPasswordResetToken", () => {
    it("should find user by password reset token", async () => {
      const futureDate = new Date(Date.now() + 3600000);
      const mockUserData = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        is_active: true,
        email_verification_token: null,
        email_verified_at: new Date(),
        password_reset_token: "reset-token",
        password_reset_expires: futureDate,
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockUserData);

      const result =
        await userRepository.findByPasswordResetToken("reset-token");

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        password_reset_token: "reset-token",
      });
      expect(result).toBeInstanceOf(User);
      expect(result?.passwordResetToken).toBe("reset-token");
    });

    it("should return null if user not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result =
        await userRepository.findByPasswordResetToken("invalid-token");

      expect(result).toBeNull();
    });
  });
});
