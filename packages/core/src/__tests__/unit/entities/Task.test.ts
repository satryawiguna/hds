import { Task } from "../../../entities/task/Task";
import { TaskStatus } from "@hds/shared";

describe("Task Entity", () => {
  describe("create", () => {
    it("should create a new task with default TO_DO status", () => {
      const title = "Test Task";
      const description = "Test Description";
      const createdBy = "user-123";

      const task = Task.create(title, description, createdBy);

      expect(task.id).toBeDefined();
      expect(task.title).toBe(title);
      expect(task.description).toBe(description);
      expect(task.status).toBe(TaskStatus.TO_DO);
      expect(task.createdBy).toBe(createdBy);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it("should create a task with specified status", () => {
      const task = Task.create(
        "Title",
        "Description",
        "user-123",
        TaskStatus.IN_PROGRESS
      );

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it("should generate unique IDs for different tasks", () => {
      const task1 = Task.create("Task 1", "Desc 1", "user-1");
      const task2 = Task.create("Task 2", "Desc 2", "user-2");

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe("updateTitle", () => {
    it("should update task title", () => {
      const task = Task.create("Original Title", "Description", "user-123");
      const beforeUpdate = task.updatedAt;

      task.updateTitle("New Title");

      expect(task.title).toBe("New Title");
      expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });
  });

  describe("updateDescription", () => {
    it("should update task description", () => {
      const task = Task.create("Title", "Original Description", "user-123");
      const beforeUpdate = task.updatedAt;

      task.updateDescription("New Description");

      expect(task.description).toBe("New Description");
      expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });
  });

  describe("updateStatus", () => {
    it("should update task status", () => {
      const task = Task.create("Title", "Description", "user-123");

      task.updateStatus(TaskStatus.IN_PROGRESS);

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it("should update timestamp when status changes", () => {
      const task = Task.create("Title", "Description", "user-123");
      const beforeUpdate = task.updatedAt;

      task.updateStatus(TaskStatus.DONE);

      expect(task.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });
  });

  describe("markAsInProgress", () => {
    it("should mark task as in progress", () => {
      const task = Task.create("Title", "Description", "user-123");

      task.markAsInProgress();

      expect(task.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });

  describe("markAsDone", () => {
    it("should mark task as done", () => {
      const task = Task.create("Title", "Description", "user-123");

      task.markAsDone();

      expect(task.status).toBe(TaskStatus.DONE);
    });
  });

  describe("markAsToDo", () => {
    it("should mark task as to do", () => {
      const task = Task.create(
        "Title",
        "Description",
        "user-123",
        TaskStatus.DONE
      );

      task.markAsToDo();

      expect(task.status).toBe(TaskStatus.TO_DO);
    });
  });

  describe("status transitions", () => {
    it("should allow transitioning through all statuses", () => {
      const task = Task.create("Title", "Description", "user-123");

      expect(task.status).toBe(TaskStatus.TO_DO);

      task.markAsInProgress();
      expect(task.status).toBe(TaskStatus.IN_PROGRESS);

      task.markAsDone();
      expect(task.status).toBe(TaskStatus.DONE);

      task.markAsToDo();
      expect(task.status).toBe(TaskStatus.TO_DO);
    });
  });
});
