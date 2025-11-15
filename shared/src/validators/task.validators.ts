import * as yup from "yup";
import { TaskStatus } from "../enums";

export const createTaskSchema = yup.object().shape({
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

export const updateTaskSchema = yup
  .object({
    title: yup.string().max(255, "Title must be at most 255 characters"),
    description: yup.string(),
    status: yup
      .mixed<TaskStatus>()
      .oneOf(Object.values(TaskStatus), "Invalid status"),
  })
  .partial();

export const getTasksQuerySchema = yup.object().shape({
  page: yup.number().integer().min(1).optional(),
  limit: yup.number().integer().min(1).max(100).optional(),
  key: yup.string().optional(),
  status: yup
    .mixed<TaskStatus>()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});

export type CreateTaskFormData = yup.InferType<typeof createTaskSchema>;
export type UpdateTaskFormData = yup.InferType<typeof updateTaskSchema>;
export type GetTasksQueryFormData = yup.InferType<typeof getTasksQuerySchema>;
