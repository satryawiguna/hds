import { Task } from "../../entities";
import { TaskStatus } from "@hds/shared";

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: { key?: string; status?: TaskStatus; createdBy?: string }
  ): Promise<{ tasks: Task[]; total: number }>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  findByCreatedBy(
    createdBy: string,
    page?: number,
    limit?: number
  ): Promise<{ tasks: Task[]; total: number }>;
}
