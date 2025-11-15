import { DeleteTaskUseCase } from "../../../../use-cases/task/DeleteTaskUseCase";
import { Task } from "../../../../entities";
import { ITaskRepository } from "../../../../interfaces";
import { TaskStatus } from "@hds/shared";

describe("DeleteTaskUseCase", () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
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

    deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
  });

  describe("execute", () => {
    const taskId = "task-id-123";
    const existingTask = new Task(
      taskId,
      "Task to Delete",
      "This task will be deleted",
      TaskStatus.TO_DO,
      "user-id-123",
      new Date(),
      new Date()
    );

    it("should delete task successfully", async () => {
      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await deleteTaskUseCase.execute(taskId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it("should throw NotFoundError if task does not exist", async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(deleteTaskUseCase.execute(taskId)).rejects.toThrow(
        "Task not found"
      );
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError with correct message", async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(deleteTaskUseCase.execute(taskId)).rejects.toThrow(
        "Task not found"
      );
    });
  });
});
