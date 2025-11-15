import { GetAllTasksUseCase } from "../../../../use-cases/task/GetAllTasksUseCase";
import { Task } from "../../../../entities";
import { ITaskRepository } from "../../../../interfaces";
import { TaskStatus } from "@hds/shared";

describe("GetAllTasksUseCase", () => {
  let getAllTasksUseCase: GetAllTasksUseCase;
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

    getAllTasksUseCase = new GetAllTasksUseCase(mockTaskRepository);
  });

  describe("execute", () => {
    const mockTasks = [
      new Task(
        "task-1",
        "Task 1",
        "Description 1",
        TaskStatus.TO_DO,
        "user-1",
        new Date(),
        new Date()
      ),
      new Task(
        "task-2",
        "Task 2",
        "Description 2",
        TaskStatus.IN_PROGRESS,
        "user-2",
        new Date(),
        new Date()
      ),
      new Task(
        "task-3",
        "Task 3",
        "Description 3",
        TaskStatus.DONE,
        "user-1",
        new Date(),
        new Date()
      ),
    ];

    it("should retrieve all tasks without pagination", async () => {
      mockTaskRepository.findAll.mockResolvedValue({
        tasks: mockTasks,
        total: mockTasks.length,
      });

      const result = await getAllTasksUseCase.execute();

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined
      );
      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(mockTasks.length);
    });

    it("should retrieve tasks with pagination", async () => {
      const page = 1;
      const limit = 10;

      mockTaskRepository.findAll.mockResolvedValue({
        tasks: mockTasks,
        total: 25,
      });

      const result = await getAllTasksUseCase.execute(page, limit);

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        page,
        limit,
        undefined
      );
      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(25);
    });

    it("should retrieve tasks with status filter", async () => {
      const filters = { status: TaskStatus.IN_PROGRESS };
      const filteredTasks = [mockTasks[1]];

      mockTaskRepository.findAll.mockResolvedValue({
        tasks: filteredTasks,
        total: 1,
      });

      const result = await getAllTasksUseCase.execute(
        undefined,
        undefined,
        filters
      );

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        filters
      );
      expect(result.tasks).toEqual(filteredTasks);
      expect(result.total).toBe(1);
    });

    it("should retrieve tasks with key filter", async () => {
      const filters = { key: "Task 1" };

      mockTaskRepository.findAll.mockResolvedValue({
        tasks: [mockTasks[0]],
        total: 1,
      });

      const result = await getAllTasksUseCase.execute(
        undefined,
        undefined,
        filters
      );

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        filters
      );
      expect(result.tasks.length).toBe(1);
    });

    it("should retrieve tasks with createdBy filter", async () => {
      const filters = { createdBy: "user-1" };
      const filteredTasks = [mockTasks[0], mockTasks[2]];

      mockTaskRepository.findAll.mockResolvedValue({
        tasks: filteredTasks,
        total: 2,
      });

      const result = await getAllTasksUseCase.execute(
        undefined,
        undefined,
        filters
      );

      expect(mockTaskRepository.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        filters
      );
      expect(result.tasks).toEqual(filteredTasks);
      expect(result.total).toBe(2);
    });

    it("should return empty array when no tasks exist", async () => {
      mockTaskRepository.findAll.mockResolvedValue({
        tasks: [],
        total: 0,
      });

      const result = await getAllTasksUseCase.execute();

      expect(result.tasks).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
