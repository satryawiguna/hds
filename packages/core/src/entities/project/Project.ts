import { ProjectStatus } from "@hds/shared";

export class Project {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: ProjectStatus,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    title: string,
    description: string,
    createdBy: string,
    status: ProjectStatus = ProjectStatus.PENDING
  ): Project {
    return new Project(
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

  updateStatus(status: ProjectStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  markAsActive(): void {
    this.status = ProjectStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  markArchive(): void {
    this.status = ProjectStatus.ARCHIVE;
    this.updatedAt = new Date();
  }

  markPending(): void {
    this.status = ProjectStatus.PENDING;
    this.updatedAt = new Date();
  }
}
