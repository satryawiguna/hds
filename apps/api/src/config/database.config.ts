import knex, { Knex } from 'knex';
import { env } from './env.config';

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../../../packages/infrastructure/database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../../../packages/infrastructure/database/seeds',
  },
};

export const db = knex(config);

export default config;
