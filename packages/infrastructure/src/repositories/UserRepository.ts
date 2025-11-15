import { Knex } from "knex";
import { IUserRepository, User } from "@hds/core";
import { UserModel } from "../database/models/types";

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Knex) {}

  async create(user: User): Promise<User> {
    const model: Partial<UserModel> = {
      id: user.id,
      email: user.email,
      password: user.password,
      is_active: user.isActive,
      email_verification_token: user.emailVerificationToken,
      email_verified_at: user.emailVerifiedAt,
      password_reset_token: user.passwordResetToken,
      password_reset_expires: user.passwordResetExpires,
      refresh_token: user.refreshToken,
    };

    await this.db("users").insert(model);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.db<UserModel>("users").where({ id }).first();
    return model ? this.toEntity(model) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.db<UserModel>("users").where({ email }).first();
    return model ? this.toEntity(model) : null;
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const model = await this.db<UserModel>("users")
      .where({ email_verification_token: token })
      .first();
    return model ? this.toEntity(model) : null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const model = await this.db<UserModel>("users")
      .where({ password_reset_token: token })
      .where("password_reset_expires", ">", new Date())
      .first();
    return model ? this.toEntity(model) : null;
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    const model = await this.db<UserModel>("users")
      .where({ refresh_token: token })
      .first();
    return model ? this.toEntity(model) : null;
  }

  async findAll(
    page?: number,
    limit?: number
  ): Promise<{ users: User[]; total: number }> {
    const query = this.db<UserModel>("users");

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
    const users = models.map((model) => this.toEntity(model));

    return { users, total: totalCount };
  }

  async update(user: User): Promise<User> {
    const model: Partial<UserModel> = {
      email: user.email,
      password: user.password,
      is_active: user.isActive,
      email_verification_token: user.emailVerificationToken,
      email_verified_at: user.emailVerifiedAt,
      password_reset_token: user.passwordResetToken,
      password_reset_expires: user.passwordResetExpires,
      refresh_token: user.refreshToken,
      updated_at: user.updatedAt,
    };

    await this.db("users").where({ id: user.id }).update(model);
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.db("users").where({ id }).delete();
  }

  private toEntity(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.password,
      model.is_active,
      model.email_verification_token,
      model.email_verified_at,
      model.password_reset_token,
      model.password_reset_expires,
      model.refresh_token,
      model.created_at,
      model.updated_at
    );
  }
}
