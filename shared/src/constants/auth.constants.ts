export const AUTH_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  PASSWORD_RESET_EXPIRES_IN: 60,
  EMAIL_VERIFICATION_EXPIRES_IN: 24 * 60,
  MIN_PASSWORD_LENGTH: 8,
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
  USER: {
    ME: "/users/me",
  },
  TASK: {
    BASE: "/tasks",
    BY_ID: (id: string) => `/tasks/${id}`,
  },
} as const;

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  REDIRECT_PATH: "redirect_path",
} as const;

export const AUTH_QUERY_KEYS = {
  ME: ["auth", "me"],
  LOGIN: ["auth", "login"],
  REGISTER: ["auth", "register"],
  LOGOUT: ["auth", "logout"],
  FORGOT_PASSWORD: ["auth", "forgot-password"],
  RESET_PASSWORD: ["auth", "reset-password"],
  VERIFY_EMAIL: ["auth", "verify-email"],
} as const;
