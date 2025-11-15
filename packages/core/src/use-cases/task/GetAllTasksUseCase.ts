import { Task } from "../../entities";
import { ITaskRepository } from "../../interfaces";
import { TaskStatus } from "@hds/shared";

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    page?: number,
    limit?: number,
    filters?: { key?: string; status?: TaskStatus }
  ): Promise<{ tasks: Task[]; total: number }> {
    return await this.taskRepository.findAll(page, limit, filters);
  }
}
