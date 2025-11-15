import { User } from "@hds/core";

export class UserBuilder {
  private id: string = "test-user-id";
  private email: string = "test@example.com";
  private password: string = "hashedPassword123";
  private isActive: boolean = true;
  private emailVerificationToken: string | null = null;
  private emailVerifiedAt: Date | null = new Date();
  private passwordResetToken: string | null = null;
  private passwordResetExpires: Date | null = null;
  private refreshToken: string | null = null;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  withId(id: string): UserBuilder {
    this.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.email = email;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.password = password;
    return this;
  }

  withActive(isActive: boolean): UserBuilder {
    this.isActive = isActive;
    return this;
  }

  withEmailVerificationToken(token: string | null): UserBuilder {
    this.emailVerificationToken = token;
    return this;
  }

  withEmailVerifiedAt(date: Date | null): UserBuilder {
    this.emailVerifiedAt = date;
    return this;
  }

  withPasswordResetToken(token: string | null): UserBuilder {
    this.passwordResetToken = token;
    return this;
  }

  withPasswordResetExpires(date: Date | null): UserBuilder {
    this.passwordResetExpires = date;
    return this;
  }

  withRefreshToken(token: string | null): UserBuilder {
    this.refreshToken = token;
    return this;
  }

  unverified(): UserBuilder {
    this.isActive = false;
    this.emailVerifiedAt = null;
    this.emailVerificationToken = "verification-token-123";
    return this;
  }

  verified(): UserBuilder {
    this.isActive = true;
    this.emailVerifiedAt = new Date();
    this.emailVerificationToken = null;
    return this;
  }

  build(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.isActive,
      this.emailVerificationToken,
      this.emailVerifiedAt,
      this.passwordResetToken,
      this.passwordResetExpires,
      this.refreshToken,
      this.createdAt,
      this.updatedAt
    );
  }
}

export const createMockUser = (overrides?: Partial<User>): User => {
  const builder = new UserBuilder();

  if (overrides?.id) builder.withId(overrides.id);
  if (overrides?.email) builder.withEmail(overrides.email);
  if (overrides?.password) builder.withPassword(overrides.password);
  if (overrides?.isActive !== undefined) builder.withActive(overrides.isActive);
  if (overrides?.emailVerificationToken !== undefined)
    builder.withEmailVerificationToken(overrides.emailVerificationToken);
  if (overrides?.emailVerifiedAt !== undefined)
    builder.withEmailVerifiedAt(overrides.emailVerifiedAt);
  if (overrides?.refreshToken !== undefined)
    builder.withRefreshToken(overrides.refreshToken);

  return builder.build();
};
