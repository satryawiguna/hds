import { TaskStatus } from "@hds/shared";

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    title: string,
    description: string,
    createdBy: string,
    status: TaskStatus = TaskStatus.TO_DO
  ): Task {
    return new Task(
      crypto.randomUUID(),
      title,
      description,
      status,
      createdBy,
      new Date(),
      new Date()
    );
  }

  updateTitle(title: string): void {
    this.title = title;
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  updateStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  markAsInProgress(): void {
    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  markAsDone(): void {
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
  }

  markAsToDo(): void {
    this.status = TaskStatus.TO_DO;
    this.updatedAt = new Date();
  }
}
