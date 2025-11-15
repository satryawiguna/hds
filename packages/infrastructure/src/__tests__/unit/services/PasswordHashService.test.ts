import { PasswordHashService } from "../../../services/PasswordHashService";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("PasswordHashService", () => {
  let passwordHashService: PasswordHashService;
  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    passwordHashService = new PasswordHashService();
    jest.clearAllMocks();
  });

  describe("hash", () => {
    it("should hash password successfully", async () => {
      const password = "MySecurePassword123!";
      const hashedPassword = "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890";

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await passwordHashService.hash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it("should use salt rounds of 10", async () => {
      const password = "TestPassword123";
      mockedBcrypt.hash.mockResolvedValue("hashedValue" as never);

      await passwordHashService.hash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("should handle different password lengths", async () => {
      const shortPassword = "Pass1!";
      const longPassword = "VeryLongPasswordWithManyCharacters123!@#$%^&*()";

      mockedBcrypt.hash.mockResolvedValue("hashed1" as never);
      await passwordHashService.hash(shortPassword);

      mockedBcrypt.hash.mockResolvedValue("hashed2" as never);
      await passwordHashService.hash(longPassword);

      expect(bcrypt.hash).toHaveBeenCalledTimes(2);
    });
  });

  describe("compare", () => {
    it("should return true for matching password and hash", async () => {
      const password = "MyPassword123!";
      const hash = "$2a$10$hashedpassword";

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await passwordHashService.compare(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const password = "WrongPassword";
      const hash = "$2a$10$hashedpassword";

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await passwordHashService.compare(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it("should handle empty password comparison", async () => {
      const password = "";
      const hash = "$2a$10$hashedpassword";

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await passwordHashService.compare(password, hash);

      expect(result).toBe(false);
    });
  });
});
