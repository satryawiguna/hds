import { User } from "../../../entities/user/User";

describe("User Entity", () => {
  describe("create", () => {
    it("should create a new user with default values", () => {
      const email = "test@example.com";
      const password = "hashedPassword123";
      const token = "verification-token";

      const user = User.create(email, password, token);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.isActive).toBe(false);
      expect(user.emailVerificationToken).toBe(token);
      expect(user.emailVerifiedAt).toBeNull();
      expect(user.passwordResetToken).toBeNull();
      expect(user.passwordResetExpires).toBeNull();
      expect(user.refreshToken).toBeNull();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("should generate unique IDs for different users", () => {
      const user1 = User.create("user1@example.com", "pass1", "token1");
      const user2 = User.create("user2@example.com", "pass2", "token2");

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("verifyEmail", () => {
    it("should verify email and activate user", () => {
      const user = User.create("test@example.com", "password", "token");
      const beforeUpdate = user.updatedAt;

      user.verifyEmail();

      expect(user.isActive).toBe(true);
      expect(user.emailVerifiedAt).toBeInstanceOf(Date);
      expect(user.emailVerificationToken).toBeNull();
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });
  });

  describe("setPasswordResetToken", () => {
    it("should set password reset token with expiry", () => {
      const user = User.create("test@example.com", "password", "token");
      const resetToken = "reset-token-123";
      const expiryMinutes = 60;

      user.setPasswordResetToken(resetToken, expiryMinutes);

      expect(user.passwordResetToken).toBe(resetToken);
      expect(user.passwordResetExpires).toBeInstanceOf(Date);

      const expectedExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
      const actualExpiry = user.passwordResetExpires!;

      expect(
        Math.abs(actualExpiry.getTime() - expectedExpiry.getTime())
      ).toBeLessThan(1000);
    });
  });

  describe("resetPassword", () => {
    it("should reset password and clear reset token", () => {
      const user = User.create("test@example.com", "oldPassword", "token");
      user.setPasswordResetToken("reset-token", 60);

      const newPassword = "newHashedPassword";
      user.resetPassword(newPassword);

      expect(user.password).toBe(newPassword);
      expect(user.passwordResetToken).toBeNull();
      expect(user.passwordResetExpires).toBeNull();
    });
  });

  describe("setRefreshToken", () => {
    it("should set refresh token", () => {
      const user = User.create("test@example.com", "password", "token");
      const refreshToken = "refresh-token-123";

      user.setRefreshToken(refreshToken);

      expect(user.refreshToken).toBe(refreshToken);
    });

    it("should clear refresh token when set to null", () => {
      const user = User.create("test@example.com", "password", "token");
      user.setRefreshToken("refresh-token-123");

      user.setRefreshToken(null);

      expect(user.refreshToken).toBeNull();
    });
  });

  describe("activate", () => {
    it("should activate user", () => {
      const user = User.create("test@example.com", "password", "token");
      const beforeUpdate = user.updatedAt;

      user.activate();

      expect(user.isActive).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });
  });

  describe("deactivate", () => {
    it("should deactivate user", () => {
      const user = User.create("test@example.com", "password", "token");
      user.activate();

      user.deactivate();

      expect(user.isActive).toBe(false);
    });
  });
});
