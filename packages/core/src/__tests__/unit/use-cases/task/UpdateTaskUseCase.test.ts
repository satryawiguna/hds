import { UpdateTaskUseCase } from "../../../../use-cases/task/UpdateTaskUseCase";
import { Task } from "../../../../entities";
import { ITaskRepository } from "../../../../interfaces";
import { TaskStatus } from "@hds/shared";

describe("UpdateTaskUseCase", () => {
  let updateTaskUseCase: UpdateTaskUseCase;
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

    updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
  });

  describe("execute", () => {
    const taskId = "task-id-123";
    const existingTask = new Task(
      taskId,
      "Original Title",
      "Original Description",
      TaskStatus.TO_DO,
      "user-id-123",
      new Date(),
      new Date()
    );

    it("should update task title", async () => {
      const updates = { title: "Updated Title" };
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockImplementation(async (task) => task);

      const result = await updateTaskUseCase.execute(taskId, updates);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.update).toHaveBeenCalled();
      expect(result.title).toBe(updates.title);
      expect(result.description).toBe(existingTask.description);
    });

    it("should update task description", async () => {
      const updates = { description: "Updated Description" };
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockImplementation(async (task) => task);

      const result = await updateTaskUseCase.execute(taskId, updates);

      expect(result.description).toBe(updates.description);
      expect(result.title).toBe(existingTask.title);
    });

    it("should update task status", async () => {
      const updates = { status: TaskStatus.DONE };
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockImplementation(async (task) => task);

      const result = await updateTaskUseCase.execute(taskId, updates);

      expect(result.status).toBe(TaskStatus.DONE);
    });

    it("should update multiple fields at once", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
        status: TaskStatus.IN_PROGRESS,
      };
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockImplementation(async (task) => task);

      const result = await updateTaskUseCase.execute(taskId, updates);

      expect(result.title).toBe(updates.title);
      expect(result.description).toBe(updates.description);
      expect(result.status).toBe(updates.status);
    });

    it("should throw NotFoundError if task does not exist", async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(
        updateTaskUseCase.execute(taskId, { title: "New Title" })
      ).rejects.toThrow("Task not found");

      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it("should not update fields that are not provided", async () => {
      const updates = { title: "Updated Title" };
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockImplementation(async (task) => task);

      const result = await updateTaskUseCase.execute(taskId, updates);

      expect(result.description).toBe(existingTask.description);
      expect(result.status).toBe(existingTask.status);
    });
  });
});
