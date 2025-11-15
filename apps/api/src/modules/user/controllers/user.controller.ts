import { Request, Response, NextFunction } from "express";
import { db } from "../../../config/database.config";
import { UserRepository, ProfileRepository } from "@hds/infrastructure";
import {
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from "@hds/core";
import { successResponse } from "../../../utils/response";
import { paginate } from "../../../utils/pagination";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { updateUserSchema, getUsersQuerySchema } from "@hds/shared";

const userRepository = new UserRepository(db);
const profileRepository = new ProfileRepository(db);

const getUserByIdUseCase = new GetUserByIdUseCase(
  userRepository,
  profileRepository
);
const getAllUsersUseCase = new GetAllUsersUseCase(
  userRepository,
  profileRepository
);
const updateUserUseCase = new UpdateUserUseCase(
  userRepository,
  profileRepository
);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const { user, profile } = await getUserByIdUseCase.execute(
        authReq.user!.id
      );

      res.json(
        successResponse({
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
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { user, profile } = await getUserByIdUseCase.execute(id);

      res.json(
        successResponse({
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
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = await getUsersQuerySchema.validate(req.query, {
        abortEarly: false,
      });
      const { users, total } = await getAllUsersUseCase.execute(
        query.page,
        query.limit
      );

      const formattedUsers = users.map(
        ({ user, profile }: { user: any; profile: any }) => ({
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
        })
      );

      if (query.page && query.limit) {
        const paginatedResponse = paginate(formattedUsers, total, query);
        res.json(successResponse(paginatedResponse));
      } else {
        res.json(successResponse({ data: formattedUsers, total }));
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = await updateUserSchema.validate(req.body, {
        abortEarly: false,
      });
      const { user, profile } = await updateUserUseCase.execute(
        id,
        validatedData
      );

      res.json(
        successResponse(
          {
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
          "User updated successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await deleteUserUseCase.execute(id);

      res.json(successResponse(null, "User deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
