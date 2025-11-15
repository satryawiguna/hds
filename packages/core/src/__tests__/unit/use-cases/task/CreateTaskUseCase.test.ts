import { CreateTaskUseCase } from "../../../../use-cases/task/CreateTaskUseCase";
import { Task } from "../../../../entities";
import { ITaskRepository } from "../../../../interfaces";
import { TaskStatus } from "@hds/shared";

describe("CreateTaskUseCase", () => {
  let createTaskUseCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCreatedBy: jest.fn(),
    };

    createTaskUseCase = new CreateTaskUseCase(mockTaskRepository);
  });

  describe("execute", () => {
    const title = "Test Task";
    const description = "This is a test task";
    const createdBy = "user-id-123";

    it("should create a task with default TO_DO status", async () => {
      mockTaskRepository.create.mockImplementation(async (task) => task);

      const result = await createTaskUseCase.execute(
        title,
        description,
        createdBy
      );

      expect(mockTaskRepository.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Task);
      expect(result.title).toBe(title);
      expect(result.description).toBe(description);
      expect(result.createdBy).toBe(createdBy);
      expect(result.status).toBe(TaskStatus.TO_DO);
    });

    it("should create a task with specified status", async () => {
      mockTaskRepository.create.mockImplementation(async (task) => task);

      const result = await createTaskUseCase.execute(
        title,
        description,
        createdBy,
        TaskStatus.IN_PROGRESS
      );

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it("should create a task with DONE status", async () => {
      mockTaskRepository.create.mockImplementation(async (task) => task);

      const result = await createTaskUseCase.execute(
        title,
        description,
        createdBy,
        TaskStatus.DONE
      );

      expect(result.status).toBe(TaskStatus.DONE);
    });

    it("should pass the task to repository for persistence", async () => {
      const createdTask = Task.create(title, description, createdBy);
      mockTaskRepository.create.mockResolvedValue(createdTask);

      await createTaskUseCase.execute(title, description, createdBy);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title,
          description,
          createdBy,
          status: TaskStatus.TO_DO,
        })
      );
    });
  });
});
