import { GetTaskByIdUseCase } from "../../../../use-cases/task/GetTaskByIdUseCase";
import { Task } from "../../../../entities";
import { ITaskRepository } from "../../../../interfaces";
import { TaskStatus } from "@hds/shared";

describe("GetTaskByIdUseCase", () => {
  let getTaskByIdUseCase: GetTaskByIdUseCase;
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

    getTaskByIdUseCase = new GetTaskByIdUseCase(mockTaskRepository);
  });

  describe("execute", () => {
    const taskId = "task-id-123";
    const mockTask = new Task(
      taskId,
      "Test Task",
      "Test Description",
      TaskStatus.TO_DO,
      "user-id-123",
      new Date(),
      new Date()
    );

    it("should retrieve task by id successfully", async () => {
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await getTaskByIdUseCase.execute(taskId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(result).toBe(mockTask);
      expect(result.id).toBe(taskId);
      expect(result.title).toBe("Test Task");
    });

    it("should throw NotFoundError if task does not exist", async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(getTaskByIdUseCase.execute(taskId)).rejects.toThrow(
        "Task not found"
      );
    });

    it("should return task with all properties", async () => {
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      const result = await getTaskByIdUseCase.execute(taskId);

      expect(result.id).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.createdBy).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });
});
