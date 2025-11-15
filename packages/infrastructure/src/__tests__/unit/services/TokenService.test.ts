import { TokenService } from "../../../services/TokenService";
import jwt from "jsonwebtoken";
import crypto from "crypto";

jest.mock("jsonwebtoken");
jest.mock("crypto");

describe("TokenService", () => {
  let tokenService: TokenService;
  const jwtSecret = "test-jwt-secret";
  const mockedJwt = jwt as jest.Mocked<typeof jwt>;
  const mockedCrypto = crypto as jest.Mocked<typeof crypto>;

  beforeEach(() => {
    tokenService = new TokenService(jwtSecret);
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("should generate access token with correct payload", () => {
      const payload = { id: "user-123", email: "test@example.com" };
      const expectedToken = "generated-access-token";

      mockedJwt.sign.mockReturnValue(expectedToken as never);

      const result = tokenService.generateAccessToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        jwtSecret,
        expect.objectContaining({
          expiresIn: expect.any(String),
        })
      );
      expect(result).toBe(expectedToken);
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate refresh token with correct payload", () => {
      const payload = { id: "user-123", email: "test@example.com" };
      const expectedToken = "generated-refresh-token";

      mockedJwt.sign.mockReturnValue(expectedToken as never);

      const result = tokenService.generateRefreshToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        jwtSecret,
        expect.objectContaining({
          expiresIn: expect.any(String),
        })
      );
      expect(result).toBe(expectedToken);
    });
  });

  describe("generateEmailVerificationToken", () => {
    it("should generate email verification token", () => {
      const mockRandomBytes = Buffer.from("random-bytes-data");
      const expectedToken = mockRandomBytes.toString("hex");

      (mockedCrypto.randomBytes as jest.Mock).mockReturnValue(mockRandomBytes);

      const result = tokenService.generateEmailVerificationToken();

      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(result).toBe(expectedToken);
    });

    it("should generate unique tokens", () => {
      const token1Buffer = Buffer.from("token1-data");
      const token2Buffer = Buffer.from("token2-data");

      (mockedCrypto.randomBytes as jest.Mock)
        .mockReturnValueOnce(token1Buffer)
        .mockReturnValueOnce(token2Buffer);

      const token1 = tokenService.generateEmailVerificationToken();
      const token2 = tokenService.generateEmailVerificationToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe("generatePasswordResetToken", () => {
    it("should generate password reset token", () => {
      const mockRandomBytes = Buffer.from("reset-token-data");
      const expectedToken = mockRandomBytes.toString("hex");

      (mockedCrypto.randomBytes as jest.Mock).mockReturnValue(mockRandomBytes);

      const result = tokenService.generatePasswordResetToken();

      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(result).toBe(expectedToken);
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify and decode access token", () => {
      const token = "valid-access-token";
      const decodedPayload = { id: "user-123", email: "test@example.com" };

      mockedJwt.verify.mockReturnValue(decodedPayload as never);

      const result = tokenService.verifyAccessToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
      expect(result).toEqual(decodedPayload);
    });

    it("should throw error for invalid token", () => {
      const token = "invalid-token";

      mockedJwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => tokenService.verifyAccessToken(token)).toThrow(
        "Invalid token"
      );
    });

    it("should throw error for expired token", () => {
      const token = "expired-token";

      mockedJwt.verify.mockImplementation(() => {
        throw new Error("Token expired");
      });

      expect(() => tokenService.verifyAccessToken(token)).toThrow(
        "Token expired"
      );
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify and decode refresh token", () => {
      const token = "valid-refresh-token";
      const decodedPayload = { id: "user-123", email: "test@example.com" };

      mockedJwt.verify.mockReturnValue(decodedPayload as never);

      const result = tokenService.verifyRefreshToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
      expect(result).toEqual(decodedPayload);
    });

    it("should throw error for invalid refresh token", () => {
      const token = "invalid-refresh-token";

      mockedJwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => tokenService.verifyRefreshToken(token)).toThrow(
        "Invalid token"
      );
    });
  });
});
