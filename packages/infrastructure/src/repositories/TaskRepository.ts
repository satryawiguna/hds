import { Knex } from "knex";
import { ITaskRepository, Task } from "@hds/core";
import { TaskStatus } from "@hds/shared";
import { TaskModel } from "../database/models/TaskModel";

export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: Knex) {}

  async create(task: Task): Promise<Task> {
    const model: Partial<TaskModel> = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      created_by: task.createdBy,
    };

    await this.db("tasks").insert(model);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    const model = await this.db<TaskModel>("tasks").where({ id }).first();
    return model ? this.toEntity(model) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
    filters?: { key?: string; status?: TaskStatus; createdBy?: string }
  ): Promise<{ tasks: Task[]; total: number }> {
    let query = this.db<TaskModel>("tasks");
    let countQuery = this.db<TaskModel>("tasks");

    if (filters?.key) {
      query = query.whereRaw("LOWER(title) LIKE ?", [
        `%${filters.key.toLowerCase()}%`,
      ]);
      countQuery = countQuery.whereRaw("LOWER(title) LIKE ?", [
        `%${filters.key.toLowerCase()}%`,
      ]);
    }

    if (filters?.status) {
      query = query.where("status", filters.status);
      countQuery = countQuery.where("status", filters.status);
    }

    if (filters?.createdBy) {
      query = query.where("created_by", filters.createdBy);
      countQuery = countQuery.where("created_by", filters.createdBy);
    }

    const countResult = await countQuery
      .count<Record<string, number>>("* as count")
      .first();
    const totalCount = countResult ? Number(countResult.count) : 0;

    if (page && limit) {
      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);
    }

    const models = await query.orderBy("created_at", "desc");
    const tasks = models.map((model) => this.toEntity(model));

    return { tasks, total: totalCount };
  }

  async findByCreatedBy(
    createdBy: string,
    page?: number,
    limit?: number
  ): Promise<{ tasks: Task[]; total: number }> {
    const query = this.db<TaskModel>("tasks").where({ created_by: createdBy });

    const countResult = await query
      .clone()
      .count<Record<string, number>>("* as count")
      .first();
    const totalCount = countResult ? Number(countResult.count) : 0;

    if (page && limit) {
      const offset = (page - 1) * limit;
      query.offset(offset).limit(limit);
    }

    const models = await query.orderBy("created_at", "desc");
    const tasks = models.map((model) => this.toEntity(model));

    return { tasks, total: totalCount };
  }

  async update(task: Task): Promise<Task> {
    const model: Partial<TaskModel> = {
      title: task.title,
      description: task.description,
      status: task.status,
      updated_at: task.updatedAt,
    };

    await this.db("tasks").where({ id: task.id }).update(model);
    return task;
  }

  async delete(id: string): Promise<void> {
    await this.db("tasks").where({ id }).delete();
  }

  private toEntity(model: TaskModel): Task {
    return new Task(
      model.id,
      model.title,
      model.description,
      model.status as TaskStatus,
      model.created_by,
      model.created_at,
      model.updated_at
    );
  }
}
