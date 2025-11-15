import { Task } from "@hds/core";
import { TaskStatus } from "@hds/shared";

export class TaskBuilder {
  private id: string = "test-task-id";
  private title: string = "Test Task";
  private description: string = "Test task description";
  private status: TaskStatus = TaskStatus.TO_DO;
  private createdBy: string = "test-user-id";
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  withId(id: string): TaskBuilder {
    this.id = id;
    return this;
  }

  withTitle(title: string): TaskBuilder {
    this.title = title;
    return this;
  }

  withDescription(description: string): TaskBuilder {
    this.description = description;
    return this;
  }

  withStatus(status: TaskStatus): TaskBuilder {
    this.status = status;
    return this;
  }

  withCreatedBy(createdBy: string): TaskBuilder {
    this.createdBy = createdBy;
    return this;
  }

  withCreatedAt(date: Date): TaskBuilder {
    this.createdAt = date;
    return this;
  }

  withUpdatedAt(date: Date): TaskBuilder {
    this.updatedAt = date;
    return this;
  }

  asToDo(): TaskBuilder {
    this.status = TaskStatus.TO_DO;
    return this;
  }

  asInProgress(): TaskBuilder {
    this.status = TaskStatus.IN_PROGRESS;
    return this;
  }

  asDone(): TaskBuilder {
    this.status = TaskStatus.DONE;
    return this;
  }

  build(): Task {
    return new Task(
      this.id,
      this.title,
      this.description,
      this.status,
      this.createdBy,
      this.createdAt,
      this.updatedAt
    );
  }
}

export const createMockTask = (overrides?: Partial<Task>): Task => {
  const builder = new TaskBuilder();

  if (overrides?.id) builder.withId(overrides.id);
  if (overrides?.title) builder.withTitle(overrides.title);
  if (overrides?.description) builder.withDescription(overrides.description);
  if (overrides?.status) builder.withStatus(overrides.status);
  if (overrides?.createdBy) builder.withCreatedBy(overrides.createdBy);
  if (overrides?.createdAt) builder.withCreatedAt(overrides.createdAt);
  if (overrides?.updatedAt) builder.withUpdatedAt(overrides.updatedAt);

  return builder.build();
};
