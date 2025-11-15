import { Task } from "../../entities";
import { ITaskRepository } from "../../interfaces";
import { TaskStatus } from "@hds/shared";
import { NotFoundError } from "../../errors";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    id: string,
    data: { title?: string; description?: string; status?: TaskStatus }
  ): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (data.title !== undefined) {
      task.updateTitle(data.title);
    }

    if (data.description !== undefined) {
      task.updateDescription(data.description);
    }

    if (data.status !== undefined) {
      task.updateStatus(data.status);
    }

    return await this.taskRepository.update(task);
  }
}
