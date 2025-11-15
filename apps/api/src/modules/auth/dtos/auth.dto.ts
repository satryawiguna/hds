import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().optional(),
  address: yup.string().optional(),
  avatar: yup.string().url("Avatar must be a valid URL").optional(),
  dateOfBirth: yup.date().optional(),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const verifyEmailSchema = yup.object({
  token: yup.string().required("Verification token is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required("Reset token is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
});

export const refreshTokenSchema = yup.object({
  refreshToken: yup.string().required("Refresh token is required"),
});

export type RegisterDTO = yup.InferType<typeof registerSchema>;
export type LoginDTO = yup.InferType<typeof loginSchema>;
export type VerifyEmailDTO = yup.InferType<typeof verifyEmailSchema>;
export type ForgotPasswordDTO = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = yup.InferType<typeof resetPasswordSchema>;
export type RefreshTokenDTO = yup.InferType<typeof refreshTokenSchema>;
