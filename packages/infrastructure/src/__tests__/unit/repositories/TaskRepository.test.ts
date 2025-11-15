import { TaskRepository } from "../../../repositories/TaskRepository";
import { Task } from "@hds/core";
import { TaskStatus } from "@hds/shared";
import { Knex } from "knex";

describe("TaskRepository", () => {
  let taskRepository: TaskRepository;
  let mockDb: jest.Mocked<Knex>;
  let mockQueryBuilder: any;

  beforeEach(() => {
    let countCalled = false;
    mockQueryBuilder = {
      where: jest.fn(function (this: any) {
        return this;
      }),
      whereRaw: jest.fn(function (this: any) {
        return this;
      }),
      first: jest.fn(function (this: any) {
        if (countCalled) {
          countCalled = false;
          return Promise.resolve({ count: 0 });
        }
        return this;
      }),
      orderBy: jest.fn(function (this: any) {
        return this;
      }),
      offset: jest.fn(function (this: any) {
        return this;
      }),
      limit: jest.fn(function (this: any) {
        return this;
      }),
      clone: jest.fn(function (this: any) {
        return this;
      }),
      count: jest.fn(function (this: any) {
        countCalled = true;
        return this;
      }),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockDb = jest.fn(() => mockQueryBuilder) as any;
    mockDb.raw = jest.fn();

    taskRepository = new TaskRepository(mockDb);
  });

  describe("create", () => {
    it("should create a new task", async () => {
      const task = Task.create("Test Task", "Test Description", "user-123");
      mockQueryBuilder.insert.mockResolvedValue([1]);

      const result = await taskRepository.create(task);

      expect(mockDb).toHaveBeenCalledWith("tasks");
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: task.id,
          title: task.title,
          description: task.description,
          created_by: task.createdBy,
        })
      );
      expect(result).toBe(task);
    });
  });

  describe("findById", () => {
    it("should find task by id", async () => {
      const mockTaskData = {
        id: "task-123",
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.TO_DO,
        created_by: "user-123",
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQueryBuilder.first.mockResolvedValue(mockTaskData);

      const result = await taskRepository.findById("task-123");

      expect(mockDb).toHaveBeenCalledWith("tasks");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: "task-123" });
      expect(result).toBeInstanceOf(Task);
      expect(result?.id).toBe(mockTaskData.id);
      expect(result?.title).toBe(mockTaskData.title);
    });

    it("should return null if task not found", async () => {
      mockQueryBuilder.first.mockResolvedValue(undefined);

      const result = await taskRepository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    const mockTasksData = [
      {
        id: "task-1",
        title: "Task 1",
        description: "Description 1",
        status: TaskStatus.TO_DO,
        created_by: "user-1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "task-2",
        title: "Task 2",
        description: "Description 2",
        status: TaskStatus.IN_PROGRESS,
        created_by: "user-2",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    it("should return all tasks without filters", async () => {
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 2 });
      mockQueryBuilder.orderBy.mockResolvedValue(mockTasksData);

      const result = await taskRepository.findAll();

      expect(result.tasks).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.tasks[0]).toBeInstanceOf(Task);
    });

    it("should return tasks with pagination", async () => {
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({
        count: 10,
      });
      mockQueryBuilder.orderBy.mockResolvedValue([mockTasksData[0]]);

      const result = await taskRepository.findAll(1, 5);

      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
      expect(result.total).toBe(10);
    });

    it("should filter tasks by status", async () => {
      const filteredTasks = [mockTasksData[1]];
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 1 });
      mockQueryBuilder.orderBy.mockResolvedValue(filteredTasks);

      const result = await taskRepository.findAll(undefined, undefined, {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "status",
        TaskStatus.IN_PROGRESS
      );
      expect(result.tasks).toHaveLength(1);
    });

    it("should filter tasks by key (search)", async () => {
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 1 });
      mockQueryBuilder.orderBy.mockResolvedValue([mockTasksData[0]]);

      await taskRepository.findAll(undefined, undefined, { key: "Task 1" });

      expect(mockQueryBuilder.whereRaw).toHaveBeenCalled();
      expect(mockQueryBuilder.whereRaw).toHaveBeenCalledWith(
        "LOWER(title) LIKE ?",
        ["%task 1%"]
      );
    });

    it("should filter tasks by createdBy", async () => {
      const filteredTasks = [mockTasksData[0]];
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 1 });
      mockQueryBuilder.orderBy.mockResolvedValue(filteredTasks);

      const result = await taskRepository.findAll(undefined, undefined, {
        createdBy: "user-1",
      });

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        "created_by",
        "user-1"
      );
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].createdBy).toBe("user-1");
    });
  });

  describe("findByCreatedBy", () => {
    it("should find tasks created by specific user", async () => {
      const mockTasksData = [
        {
          id: "task-1",
          title: "User Task 1",
          description: "Description 1",
          status: TaskStatus.TO_DO,
          created_by: "user-123",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({ count: 1 });
      mockQueryBuilder.orderBy.mockResolvedValue(mockTasksData);

      const result = await taskRepository.findByCreatedBy("user-123");

      expect(mockQueryBuilder.where).toHaveBeenCalledWith({
        created_by: "user-123",
      });
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].createdBy).toBe("user-123");
    });

    it("should support pagination for user tasks", async () => {
      (mockQueryBuilder.first as jest.Mock).mockResolvedValueOnce({
        count: 15,
      });
      mockQueryBuilder.orderBy.mockResolvedValue([]);

      await taskRepository.findByCreatedBy("user-123", 2, 10);

      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(10);
    });
  });

  describe("update", () => {
    it("should update task", async () => {
      const task = new Task(
        "task-123",
        "Updated Title",
        "Updated Description",
        TaskStatus.DONE,
        "user-123",
        new Date(),
        new Date()
      );

      mockQueryBuilder.update.mockResolvedValue(1);

      const result = await taskRepository.update(task);

      expect(mockDb).toHaveBeenCalledWith("tasks");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: task.id });
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: task.title,
          description: task.description,
          status: task.status,
        })
      );
      expect(result).toBe(task);
    });
  });

  describe("delete", () => {
    it("should delete task by id", async () => {
      mockQueryBuilder.delete.mockResolvedValue(1);

      await taskRepository.delete("task-123");

      expect(mockDb).toHaveBeenCalledWith("tasks");
      expect(mockQueryBuilder.where).toHaveBeenCalledWith({ id: "task-123" });
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
    });
  });
});
