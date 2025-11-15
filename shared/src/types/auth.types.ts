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
