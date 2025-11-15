import { Profile } from "../../entities/user/Profile";

export interface IProfileRepository {
  create(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{ profiles: Profile[]; total: number }>;
  update(profile: Profile): Promise<Profile>;
  delete(id: string): Promise<void>;
}
