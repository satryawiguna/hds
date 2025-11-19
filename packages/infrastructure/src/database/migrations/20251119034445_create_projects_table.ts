import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("projects", (table) => {
    table.uuid("id").primary();
    table.string("title", 255).notNullable();
    table.text("description").notNullable();
    table
      .enum("status", ["pending", "active", "archive"])
      .notNullable()
      .defaultTo("pending");
    table
      .uuid("created_by")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamps(true, true);

    // Indexes
    table.index("created_by");
    table.index("status");
    table.index("title");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("projects");
}
