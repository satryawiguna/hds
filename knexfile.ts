import type { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config();

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3307", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "hds_db",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "./packages/infrastructure/src/database/migrations",
    tableName: "knex_migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./packages/infrastructure/src/database/seeds",
    extension: "ts",
  },
};

export default config;
