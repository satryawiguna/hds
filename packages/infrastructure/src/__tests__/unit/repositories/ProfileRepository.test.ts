import { ProfileRepository } from "../../../repositories/ProfileRepository";
import { Profile } from "@hds/core";
import { Knex } from "knex";

describe("ProfileRepository", () => {
  let profileRepository: ProfileRepository;
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

    profileRepository = new ProfileRepository(mockDb);
  });

  describe("create", () => {
    it("should create a new profile", async () => {
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
      mockQueryBuilder.insert.mockResolvedValue([1]);

      const result = await profileRepository.create(profile);

      expect(mockDb).toHaveBeenCalledWith("profiles");
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: profile.id,
          user_id: profile.userId,
          first_name: profile.firstName,
          last_name: profile.lastName,
        })
      );
      expect(result).toBe(profile);
    });
  });

  describe("findById", () => {
    it("should find profile by id", async () => {
      const mockProfileData = {
        id: "profile-123",
        user_id: "user-123",
        first_name: "John",
        last_name: "Doe",
        phone_number: null,
        address: null,
        avatar: null,
        date_of_birth: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockProfileData);

      const result = await profileRepository.findById("profile-123");

      expect(mockDb).toHaveBeenCalledWith("profiles");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        id: "profile-123",
      });
      expect(result).toBeInstanceOf(Profile);
      expect(result?.id).toBe(mockProfileData.id);
    });

    it("should return null if profile not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await profileRepository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should find profile by user id", async () => {
      const mockProfileData = {
        id: "profile-123",
        user_id: "user-123",
        first_name: "John",
        last_name: "Doe",
        phone_number: null,
        address: null,
        avatar: null,
        date_of_birth: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockProfileData);

      const result = await profileRepository.findByUserId("user-123");

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        user_id: "user-123",
      });
      expect(result).toBeInstanceOf(Profile);
      expect(result?.userId).toBe(mockProfileData.user_id);
    });

    it("should return null if profile not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await profileRepository.findByUserId("non-existent-user");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all profiles without pagination", async () => {
      const mockProfilesData = [
        {
          id: "profile-1",
          user_id: "user-1",
          first_name: "John",
          last_name: "Doe",
          phone_number: null,
          address: null,
          avatar: null,
          date_of_birth: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: "profile-2",
          user_id: "user-2",
          first_name: "Jane",
          last_name: "Smith",
          phone_number: null,
          address: null,
          avatar: null,
          date_of_birth: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      // Mock the count query result
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 2 });
      mockQueryBuilder.orderBy.mockResolvedValue(mockProfilesData);

      const result = await profileRepository.findAll();

      expect(result.profiles).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.profiles[0]).toBeInstanceOf(Profile);
    });

    it("should return paginated profiles", async () => {
      const mockProfilesData = [
        {
          id: "profile-1",
          user_id: "user-1",
          first_name: "John",
          last_name: "Doe",
          phone_number: null,
          address: null,
          avatar: null,
          date_of_birth: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({
        count: 10,
      });
      mockQueryBuilder.orderBy.mockResolvedValue(mockProfilesData);

      const result = await profileRepository.findAll(2, 5);

      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(result.total).toBe(10);
    });
  });

  describe("update", () => {
    it("should update profile", async () => {
      const profile = new Profile(
        "profile-123",
        "user-123",
        "John",
        "Updated",
        "1234567890",
        "123 Street",
        "avatar.jpg",
        new Date("1990-01-01"),
        new Date(),
        new Date()
      );

      mockQueryBuilder.update.mockResolvedValue(1);

      const result = await profileRepository.update(profile);

      expect(mockDb).toHaveBeenCalledWith("profiles");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: profile.id });
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone_number: profile.phoneNumber,
        })
      );
      expect(result).toBe(profile);
    });
  });

  describe("delete", () => {
    it("should delete profile by id", async () => {
      mockQueryBuilder.delete.mockResolvedValue(1);

      await profileRepository.delete("profile-123");

      expect(mockDb).toHaveBeenCalledWith("profiles");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        id: "profile-123",
      });
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
    });
  });
});
