import { IPasswordHashService, ITokenService, IEmailService } from "@hds/core";

export const createMockPasswordHashService =
  (): jest.Mocked<IPasswordHashService> => ({
    hash: jest.fn(),
    compare: jest.fn(),
  });

export const createMockTokenService = (): jest.Mocked<ITokenService> => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  generateEmailVerificationToken: jest.fn(),
  generatePasswordResetToken: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
});

export const createMockEmailService = (): jest.Mocked<IEmailService> => ({
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
});
