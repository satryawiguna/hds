import { ProjectStatus } from "@hds/shared";
import { Project } from "../../entities/project/Project";

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: { key?: string; status?: ProjectStatus; createdBy?: string }
  ): Promise<{ projects: Project[]; total: number }>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
  findByCreatedBy(
    createdBy: string,
    page?: number,
    limit?: number
  ): Promise<{ projects: Project[]; total: number }>;
}
