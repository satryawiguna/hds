import { Task } from "../../entities";
import { ITaskRepository } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return task;
  }
}
