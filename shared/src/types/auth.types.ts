export interface UserDTO {
  id: string;
  email: string;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDTO {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  dateOfBirth: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithProfileDTO extends UserDTO {
  profile: ProfileDTO | null;
}

export interface AuthTokensDTO {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseDTO {
  user: UserWithProfileDTO;
  tokens: AuthTokensDTO;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RegisterRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequestDTO {
  token: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
