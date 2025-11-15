import * as yup from "yup";
import { AUTH_CONSTANTS } from "@hds/shared";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(
      AUTH_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`
    )
    .required("Password is required"),
});

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(
      AUTH_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(
      AUTH_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
