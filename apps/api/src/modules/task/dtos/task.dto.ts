import * as yup from "yup";
import { TaskStatus } from "@hds/shared";

export const createTaskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: yup.string().required("Description is required"),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional()
    .default(TaskStatus.TO_DO),
});

export const updateTaskSchema = yup.object({
  title: yup
    .string()
    .max(255, "Title must be at most 255 characters")
    .optional(),
  description: yup.string().optional(),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});

export const getTasksQuerySchema = yup.object({
  page: yup.number().integer().min(1).optional(),
  limit: yup.number().integer().min(1).max(100).optional(),
  key: yup.string().optional(),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});

export type CreateTaskDTO = yup.InferType<typeof createTaskSchema>;
export type UpdateTaskDTO = yup.InferType<typeof updateTaskSchema>;
export type GetTasksQueryDTO = yup.InferType<typeof getTasksQuerySchema>;
