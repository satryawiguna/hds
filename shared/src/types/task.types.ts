import { TaskStatus } from "../enums";

export interface TaskFilters {
  key?: string;
  status?: TaskStatus;
  page?: number;
  limit?: number;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
  createdBy: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
