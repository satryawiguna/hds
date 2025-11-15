import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ITokenService } from "@hds/core";
import { AUTH_CONSTANTS } from "@hds/shared";

export class TokenService implements ITokenService {
  constructor(private readonly jwtSecret: string) {}

  generateAccessToken(payload: { id: string; email: string }): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload: { id: string; email: string }): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  generateEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  verifyAccessToken(token: string): { id: string; email: string } {
    return jwt.verify(token, this.jwtSecret) as { id: string; email: string };
  }

  verifyRefreshToken(token: string): { id: string; email: string } {
    return jwt.verify(token, this.jwtSecret) as { id: string; email: string };
  }
}
