export interface ITokenService {
  generateAccessToken(payload: { id: string; email: string }): string;
  generateRefreshToken(payload: { id: string; email: string }): string;
  generateEmailVerificationToken(): string;
  generatePasswordResetToken(): string;
  verifyAccessToken(token: string): { id: string; email: string };
  verifyRefreshToken(token: string): { id: string; email: string };
}
