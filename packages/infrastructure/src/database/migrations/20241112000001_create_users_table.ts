import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("email", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.boolean("is_active").notNullable().defaultTo(false);
    table.string("email_verification_token", 255).nullable();
    table.timestamp("email_verified_at").nullable();
    table.string("password_reset_token", 255).nullable();
    table.timestamp("password_reset_expires").nullable();
    table.text("refresh_token").nullable();
    table.timestamps(true, true);

    // Indexes
    table.index("email");
    table.index("email_verification_token");
    table.index("password_reset_token");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
