export class TaskAssignment {
  constructor(
    public readonly id: string,
    public readonly taskId: string,
    public readonly userId: string,
    public projectId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    taskId: string,
    userId: string,
    projectId: string | null = null
  ): TaskAssignment {
    return new TaskAssignment(
      crypto.randomUUID(),
      taskId,
      userId,
      projectId,
      new Date(),
      new Date()
    );
  }

  updateProject(projectId: string | null): void {
    this.projectId = projectId;
    this.updatedAt = new Date();
  }
}
