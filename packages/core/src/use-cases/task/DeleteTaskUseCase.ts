import { ITaskRepository } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    await this.taskRepository.delete(id);
  }
}
