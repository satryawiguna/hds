import { Task } from "../../entities";
import { ITaskRepository } from "../../interfaces";
import { TaskStatus } from "@hds/shared";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    title: string,
    description: string,
    createdBy: string,
    status?: TaskStatus
  ): Promise<Task> {
    const task = Task.create(title, description, createdBy, status);
    return await this.taskRepository.create(task);
  }
}
