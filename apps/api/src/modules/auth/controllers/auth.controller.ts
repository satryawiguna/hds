import { Request, Response, NextFunction } from "express";
import { db } from "../../../config/database.config";
import { env } from "../../../config/env.config";
import {
  UserRepository,
  ProfileRepository,
  PasswordHashService,
  TokenService,
  EmailService,
} from "@hds/infrastructure";
import {
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  VerifyEmailUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
} from "@hds/core";
import { successResponse } from "../../../utils/response";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../dtos";

const userRepository = new UserRepository(db);
const profileRepository = new ProfileRepository(db);
const passwordHashService = new PasswordHashService();
const tokenService = new TokenService(env.jwtSecret);
const emailService = new EmailService();

const registerUseCase = new RegisterUseCase(
  userRepository,
  profileRepository,
  passwordHashService,
  tokenService,
  emailService
);
const loginUseCase = new LoginUseCase(
  userRepository,
  profileRepository,
  passwordHashService,
  tokenService
);
const logoutUseCase = new LogoutUseCase(userRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(
  userRepository,
  tokenService
);
const verifyEmailUseCase = new VerifyEmailUseCase(userRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepository,
  tokenService,
  emailService
);
const resetPasswordUseCase = new ResetPasswordUseCase(
  userRepository,
  passwordHashService
);

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = await registerSchema.validate(req.body, {
        abortEarly: false,
      });
      const { user, profile } = await registerUseCase.execute(validatedData);

      res.status(201).json(
        successResponse(
          {
            user: {
              id: user.id,
              email: user.email,
              isActive: user.isActive,
              emailVerifiedAt: user.emailVerifiedAt,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
            profile: {
              id: profile.id,
              userId: profile.userId,
              firstName: profile.firstName,
              lastName: profile.lastName,
              phoneNumber: profile.phoneNumber,
              address: profile.address,
              avatar: profile.avatar,
              dateOfBirth: profile.dateOfBirth,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
            },
          },
          "Registration successful. Please check your email to verify your account."
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = await loginSchema.validate(req.body, {
        abortEarly: false,
      });
      const { user, profile, accessToken, refreshToken } =
        await loginUseCase.execute(validatedData);

      res.json(
        successResponse({
          user: {
            id: user.id,
            email: user.email,
            isActive: user.isActive,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profile: profile
              ? {
                  id: profile.id,
                  userId: profile.userId,
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  phoneNumber: profile.phoneNumber,
                  address: profile.address,
                  avatar: profile.avatar,
                  dateOfBirth: profile.dateOfBirth,
                  createdAt: profile.createdAt,
                  updatedAt: profile.updatedAt,
                }
              : null,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      if (authReq.user) {
        await logoutUseCase.execute(authReq.user.id);
      }
      res.json(successResponse(null, "Logout successful"));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = await refreshTokenSchema.validate(req.body, {
        abortEarly: false,
      });
      const tokens = await refreshTokenUseCase.execute(
        validatedData.refreshToken
      );

      res.json(successResponse({ tokens }));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = await verifyEmailSchema.validate(req.body, {
        abortEarly: false,
      });
      await verifyEmailUseCase.execute(validatedData.token);

      res.json(successResponse(null, "Email verified successfully"));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = await forgotPasswordSchema.validate(req.body, {
        abortEarly: false,
      });
      await forgotPasswordUseCase.execute(validatedData.email);

      res.json(
        successResponse(null, "Password reset instructions sent to your email")
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = await resetPasswordSchema.validate(req.body, {
        abortEarly: false,
      });
      await resetPasswordUseCase.execute(
        validatedData.token,
        validatedData.newPassword
      );

      res.json(successResponse(null, "Password reset successfully"));
    } catch (error) {
      next(error);
    }
  }
}
