import { Request, Response, NextFunction } from "express";

export const createMockRequest = (
  overrides?: Partial<Request>
): Partial<Request> => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  };
};

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res;
};

export const createMockNext = (): NextFunction => {
  return jest.fn() as NextFunction;
};

export const createAuthenticatedRequest = (
  userId: string,
  email: string,
  overrides?: Partial<Request>
): Partial<Request> => {
  return {
    ...createMockRequest(overrides),
    user: { id: userId, email },
  };
};
