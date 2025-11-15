import * as yup from "yup";
import { TaskStatus } from "../enums";

export const createTaskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: yup.string().required("Description is required"),
  status: yup
    .string()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .default(TaskStatus.TO_DO),
});

export const updateTaskSchema = yup.object().shape({
  title: yup
    .string()
    .max(255, "Title must be at most 255 characters")
    .optional(),
  description: yup.string().optional(),
  status: yup
    .string()
    .oneOf(Object.values(TaskStatus), "Invalid status")
    .optional(),
});

export type CreateTaskFormData = yup.InferType<typeof createTaskSchema>;
export type UpdateTaskFormData = yup.InferType<typeof updateTaskSchema>;
