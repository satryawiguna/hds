import { Knex } from "knex";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function seed(knex: Knex): Promise<void> {
  await knex("profiles").del();
  await knex("users").del();

  const password = await bcrypt.hash("Password123!", 10);

  const users = [
    {
      id: crypto.randomUUID(),
      email: "admin@example.com",
      password: password,
      is_active: true,
      email_verification_token: null,
      email_verified_at: new Date(),
      password_reset_token: null,
      password_reset_expires: null,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      email: "john.doe@example.com",
      password: password,
      is_active: true,
      email_verification_token: null,
      email_verified_at: new Date(),
      password_reset_token: null,
      password_reset_expires: null,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      email: "jane.smith@example.com",
      password: password,
      is_active: false,
      email_verification_token: crypto.randomBytes(32).toString("hex"),
      email_verified_at: null,
      password_reset_token: null,
      password_reset_expires: null,
      refresh_token: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await knex("users").insert(users);

  const profiles = [
    {
      id: crypto.randomUUID(),
      user_id: users[0].id,
      first_name: "Admin",
      last_name: "User",
      phone_number: "+1234567890",
      address: "123 Admin Street, Admin City, AC 12345",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      date_of_birth: new Date("1990-01-15"),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      user_id: users[1].id,
      first_name: "John",
      last_name: "Doe",
      phone_number: "+1987654321",
      address: "456 User Avenue, User City, UC 67890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      date_of_birth: new Date("1985-06-20"),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: crypto.randomUUID(),
      user_id: users[2].id,
      first_name: "Jane",
      last_name: "Smith",
      phone_number: null,
      address: null,
      avatar: null,
      date_of_birth: new Date("1995-03-10"),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await knex("profiles").insert(profiles);

  console.log("✅ Seed data inserted successfully!");
  console.log("📧 Test user credentials:");
  console.log("   Email: admin@example.com");
  console.log("   Password: Password123!");
  console.log("   Status: Active");
  console.log("");
  console.log("   Email: john.doe@example.com");
  console.log("   Password: Password123!");
  console.log("   Status: Active");
  console.log("");
  console.log("   Email: jane.smith@example.com");
  console.log("   Password: Password123!");
  console.log("   Status: Inactive (email not verified)");
}
