import { IEmailService } from "@hds/core";

export class EmailService implements IEmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    console.log("=".repeat(60));
    console.log("📧 EMAIL VERIFICATION");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your Email Address`);
    console.log(`\nVerification Token: ${token}`);
    console.log(`\nPlease use this token to verify your email address.`);
    console.log(`The token will expire in 24 hours.`);
    console.log("=".repeat(60));
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    console.log("=".repeat(60));
    console.log("🔐 PASSWORD RESET");
    console.log("=".repeat(60));
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password`);
    console.log(`\nPassword Reset Token: ${token}`);
    console.log(`\nPlease use this token to reset your password.`);
    console.log(`The token will expire in 60 minutes.`);
    console.log("=".repeat(60));
  }
}
