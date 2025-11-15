export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public isActive: boolean,
    public emailVerificationToken: string | null,
    public emailVerifiedAt: Date | null,
    public passwordResetToken: string | null,
    public passwordResetExpires: Date | null,
    public refreshToken: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    email: string,
    password: string,
    emailVerificationToken: string
  ): User {
    return new User(
      crypto.randomUUID(),
      email,
      password,
      false,
      emailVerificationToken,
      null,
      null,
      null,
      null,
      new Date(),
      new Date()
    );
  }

  verifyEmail(): void {
    this.isActive = true;
    this.emailVerifiedAt = new Date();
    this.emailVerificationToken = null;
    this.updatedAt = new Date();
  }

  setPasswordResetToken(token: string, expiresInMinutes: number): void {
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(
      Date.now() + expiresInMinutes * 60 * 1000
    );
    this.updatedAt = new Date();
  }

  resetPassword(newPassword: string): void {
    this.password = newPassword;
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
    this.updatedAt = new Date();
  }

  setRefreshToken(token: string | null): void {
    this.refreshToken = token;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
