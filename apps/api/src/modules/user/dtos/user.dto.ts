import * as yup from "yup";

export const updateUserSchema = yup.object({
  email: yup.string().email("Invalid email format").optional(),
  isActive: yup.boolean().optional(),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phoneNumber: yup.string().nullable().optional(),
  address: yup.string().nullable().optional(),
  avatar: yup.string().url("Avatar must be a valid URL").nullable().optional(),
  dateOfBirth: yup.date().nullable().optional(),
});

export const getUsersQuerySchema = yup.object({
  page: yup.number().integer().min(1).optional(),
  limit: yup.number().integer().min(1).max(100).optional(),
});

export type UpdateUserDTO = yup.InferType<typeof updateUserSchema>;
export type GetUsersQueryDTO = yup.InferType<typeof getUsersQuerySchema>;
