export interface UserModel {
  id: string;
  email: string;
  password: string;
  is_active: boolean;
  email_verification_token: string | null;
  email_verified_at: Date | null;
  password_reset_token: string | null;
  password_reset_expires: Date | null;
  refresh_token: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProfileModel {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  address: string | null;
  avatar: string | null;
  date_of_birth: Date | null;
  created_at: Date;
  updated_at: Date;
}
