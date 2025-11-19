import { Knex } from "knex";
import { IProfileRepository, Profile } from "@hds/core";
import { ProfileModel } from "../database/models/ProfileModel";

export class ProfileRepository implements IProfileRepository {
  constructor(private readonly db: Knex) {}

  async create(profile: Profile): Promise<Profile> {
    const model: Partial<ProfileModel> = {
      id: profile.id,
      user_id: profile.userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone_number: profile.phoneNumber,
      address: profile.address,
      avatar: profile.avatar,
      date_of_birth: profile.dateOfBirth,
    };

    await this.db("profiles").insert(model);
    return profile;
  }

  async findById(id: string): Promise<Profile | null> {
    const model = await this.db<ProfileModel>("profiles").where({ id }).first();
    return model ? this.toEntity(model) : null;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const model = await this.db<ProfileModel>("profiles")
      .where({ user_id: userId })
      .first();
    return model ? this.toEntity(model) : null;
  }

  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ profiles: Profile[]; total: number }> {
    const query = this.db<ProfileModel>("profiles");

    const countResult = await query
      .clone()
      .count<Record<string, number>>("* as count")
      .first();
    const totalCount = countResult ? Number(countResult.count) : 0;

    if (page && limit) {
      const offset = (page - 1) * limit;
      query.offset(offset).limit(limit);
    }

    const models = await query.orderBy("created_at", "desc");
    const profiles = models.map((model) => this.toEntity(model));

    return { profiles, total: totalCount };
  }

  async update(profile: Profile): Promise<Profile> {
    const model: Partial<ProfileModel> = {
      first_name: profile.firstName,
      last_name: profile.lastName,
      phone_number: profile.phoneNumber,
      address: profile.address,
      avatar: profile.avatar,
      date_of_birth: profile.dateOfBirth,
      updated_at: profile.updatedAt,
    };

    await this.db("profiles").where({ id: profile.id }).update(model);
    return profile;
  }

  async delete(id: string): Promise<void> {
    await this.db("profiles").where({ id }).delete();
  }

  private toEntity(model: ProfileModel): Profile {
    return new Profile(
      model.id,
      model.user_id,
      model.first_name,
      model.last_name,
      model.phone_number,
      model.address,
      model.avatar,
      model.date_of_birth,
      model.created_at,
      model.updated_at
    );
  }
}
