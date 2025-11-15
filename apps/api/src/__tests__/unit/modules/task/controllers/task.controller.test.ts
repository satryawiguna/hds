import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../../../middlewares/auth.middleware";
import { Task } from "@hds/core";
import { TaskStatus } from "@hds/shared";

const mockCreateExecute = jest.fn();
const mockGetAllExecute = jest.fn();
const mockGetByIdExecute = jest.fn();
const mockUpdateExecute = jest.fn();
const mockDeleteExecute = jest.fn();

jest.mock("@hds/core", () => ({
  ...jest.requireActual("@hds/core"),
  CreateTaskUseCase: jest.fn().mockImplementation(() => ({
    execute: mockCreateExecute,
  })),
  GetAllTasksUseCase: jest.fn().mockImplementation(() => ({
    execute: mockGetAllExecute,
  })),
  GetTaskByIdUseCase: jest.fn().mockImplementation(() => ({
    execute: mockGetByIdExecute,
  })),
  UpdateTaskUseCase: jest.fn().mockImplementation(() => ({
    execute: mockUpdateExecute,
  })),
  DeleteTaskUseCase: jest.fn().mockImplementation(() => ({
    execute: mockDeleteExecute,
  })),
}));

jest.mock("../../../../../config/database.config", () => ({
  db: {},
}));

jest.mock("@hds/infrastructure", () => ({
  TaskRepository: jest.fn(),
}));

import { TaskController } from "../../../../../modules/task/controllers/task.controller";

describe("TaskController", () => {
  let taskController: TaskController;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    taskController = new TaskController();

    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { id: "user-123", email: "test@example.com" },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    // Clear all mocks including the execute functions
    jest.clearAllMocks();
    mockCreateExecute.mockReset();
    mockGetAllExecute.mockReset();
    mockGetByIdExecute.mockReset();
    mockUpdateExecute.mockReset();
    mockDeleteExecute.mockReset();
  });

  describe("create", () => {
    it("should create a new task successfully", async () => {
      const mockTask = new Task(
        "task-123",
        "Test Task",
        "Test Description",
        TaskStatus.TO_DO,
        "user-123",
        new Date(),
        new Date()
      );

      mockRequest.body = {
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.TO_DO,
      };

      mockCreateExecute.mockResolvedValue(mockTask);

      await taskController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            id: mockTask.id,
            title: mockTask.title,
            description: mockTask.description,
          }),
        })
      );
    });

    it("should handle validation errors", async () => {
      mockRequest.body = {
        title: "",
        description: "",
      };

      await taskController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("should retrieve all tasks", async () => {
      const mockTasks = [
        new Task(
          "task-1",
          "Task 1",
          "Desc 1",
          TaskStatus.TO_DO,
          "user-1",
          new Date(),
          new Date()
        ),
        new Task(
          "task-2",
          "Task 2",
          "Desc 2",
          TaskStatus.IN_PROGRESS,
          "user-2",
          new Date(),
          new Date()
        ),
      ];

      mockRequest.query = {};

      mockGetAllExecute.mockResolvedValue({
        tasks: mockTasks,
        total: 2,
      });

      await taskController.getAll(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            data: expect.any(Array),
            total: 2,
          }),
        })
      );
    });

    it("should retrieve tasks with pagination", async () => {
      mockRequest.query = {
        page: "1",
        limit: "10",
      };

      mockGetAllExecute.mockResolvedValue({
        tasks: [],
        total: 0,
      });

      await taskController.getAll(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should filter tasks by status", async () => {
      mockRequest.query = {
        status: TaskStatus.TO_DO,
      };

      mockGetAllExecute.mockResolvedValue({
        tasks: [],
        total: 0,
      });

      await taskController.getAll(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should retrieve task by id", async () => {
      const mockTask = new Task(
        "task-123",
        "Test Task",
        "Test Description",
        TaskStatus.TO_DO,
        "user-123",
        new Date(),
        new Date()
      );

      mockRequest.params = { id: "task-123" };

      mockGetByIdExecute.mockResolvedValue(mockTask);

      await taskController.getById(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.objectContaining({
            id: mockTask.id,
            title: mockTask.title,
          }),
        })
      );
    });

    it("should handle task not found", async () => {
      mockRequest.params = { id: "non-existent" };

      const error = new Error("Task not found");
      mockGetByIdExecute.mockRejectedValue(error);

      await taskController.getById(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update task successfully", async () => {
      const mockTask = new Task(
        "task-123",
        "Updated Task",
        "Updated Description",
        TaskStatus.IN_PROGRESS,
        "user-123",
        new Date(),
        new Date()
      );

      mockRequest.params = { id: "task-123" };
      mockRequest.body = {
        title: "Updated Task",
        status: TaskStatus.DONE,
      };

      mockUpdateExecute.mockResolvedValue(mockTask);

      await taskController.update(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Task updated successfully",
        })
      );
    });
  });

  describe("delete", () => {
    it("should delete task successfully", async () => {
      mockRequest.params = { id: "task-123" };

      mockDeleteExecute.mockResolvedValue(undefined);

      await taskController.delete(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success",
          message: "Task deleted successfully",
        })
      );
    });

    it("should handle delete errors", async () => {
      mockRequest.params = { id: "task-123" };

      const error = new Error("Delete failed");
      mockDeleteExecute.mockRejectedValue(error);

      await taskController.delete(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
