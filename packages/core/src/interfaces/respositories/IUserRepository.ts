import { User } from "../../entities/user/User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailVerificationToken(token: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  findByRefreshToken(token: string): Promise<User | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{ users: User[]; total: number }>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
