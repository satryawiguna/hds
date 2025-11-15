import { EmailService } from "../../../services/EmailService";

describe("EmailService", () => {
  let emailService: EmailService;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    emailService = new EmailService();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("sendVerificationEmail", () => {
    it("should send verification email with correct information", async () => {
      const email = "test@example.com";
      const token = "verification-token-123";

      await emailService.sendVerificationEmail(email, token);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("EMAIL VERIFICATION")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(`To: ${email}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Verify Your Email Address")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Verification Token: ${token}`)
      );
    });

    it("should handle different email addresses", async () => {
      const email = "another@example.com";
      const token = "token-456";

      await emailService.sendVerificationEmail(email, token);

      expect(consoleLogSpy).toHaveBeenCalledWith(`To: ${email}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Verification Token: ${token}`)
      );
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("should send password reset email with correct information", async () => {
      const email = "test@example.com";
      const token = "reset-token-123";

      await emailService.sendPasswordResetEmail(email, token);

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("PASSWORD RESET")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(`To: ${email}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Reset Your Password")
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Password Reset Token: ${token}`)
      );
    });

    it("should handle different email addresses", async () => {
      const email = "reset@example.com";
      const token = "token-789";

      await emailService.sendPasswordResetEmail(email, token);

      expect(consoleLogSpy).toHaveBeenCalledWith(`To: ${email}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Password Reset Token: ${token}`)
      );
    });
  });
});
