import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("task_assignments", (table) => {
    table.uuid("id").primary();
    table
      .uuid("task_id")
      .notNullable()
      .references("id")
      .inTable("tasks")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.uuid("project_id").nullable();
    table.timestamps(true, true);

    // Indexes
    table.index("task_id");
    table.index("user_id");
    table.index("project_id");

    // Unique constraint to prevent duplicate assignments
    table.unique(["task_id", "user_id", "project_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("task_assignments");
}
