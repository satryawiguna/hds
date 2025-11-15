import {
  IUserRepository,
  IProfileRepository,
  ITaskRepository,
} from "@hds/core";

export const createMockUserRepository = (): jest.Mocked<IUserRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByEmailVerificationToken: jest.fn(),
  findByPasswordResetToken: jest.fn(),
  findByRefreshToken: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createMockProfileRepository =
  (): jest.Mocked<IProfileRepository> => ({
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

export const createMockTaskRepository = (): jest.Mocked<ITaskRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByCreatedBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
