import { IProjectRepository } from "@hds/core";
import { Project } from "@hds/core/dist/entities/project/Project";
import { Knex } from "knex";
import { ProjectModel } from "../database/models/ProjectModel";
import { ProjectStatus } from "@hds/shared/dist/enums/project.enums";

export class ProjectRepository implements IProjectRepository {
  constructor(private readonly db: Knex) {}

  async create(project: Project): Promise<Project> {
    const model: Partial<ProjectModel> = {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      created_by: project.createdBy,
    };

    await this.db("projects").insert(model);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const model = await this.db<ProjectModel>("projects").where({ id }).first();
    return model ? this.toEntity(model) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
    filters?: { key?: string; status?: ProjectStatus; createdBy?: string }
  ): Promise<{ projects: Project[]; total: number }> {
    let query = this.db<ProjectModel>("projects");
    let countQuery = this.db<ProjectModel>("projects");

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
    const projects = models.map((model) => this.toEntity(model));

    return { projects, total: totalCount };
  }

  async findByCreatedBy(
    createdBy: string,
    page?: number,
    limit?: number
  ): Promise<{ projects: Project[]; total: number }> {
    const query = this.db<ProjectModel>("projects").where({
      created_by: createdBy,
    });

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
    const projects = models.map((model) => this.toEntity(model));

    return { projects, total: totalCount };
  }

  async update(project: Project): Promise<Project> {
    const model: Partial<ProjectModel> = {
      title: project.title,
      description: project.description,
      status: project.status,
      updated_at: project.updatedAt,
    };

    await this.db("projects").where({ id: project.id }).update(model);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.db("projects").where({ id }).delete();
  }

  private toEntity(model: ProjectModel): Project {
    return new Project(
      model.id,
      model.title,
      model.description,
      model.status as ProjectStatus,
      model.created_by,
      model.created_at,
      model.updated_at
    );
  }
}
