import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("profiles", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable().unique();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("phone_number", 20).nullable();
    table.text("address").nullable();
    table.string("avatar", 500).nullable();
    table.date("date_of_birth").nullable();
    table.timestamps(true, true);

    // Foreign key
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    // Index
    table.index("user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("profiles");
}
