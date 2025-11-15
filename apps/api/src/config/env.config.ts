import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.API_PORT || "3001", 10),
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  swagger: {
    user: process.env.SWAGGER_USER || "admin",
    password: process.env.SWAGGER_PASSWORD || "admin123",
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3307", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "hds_db",
  },
};
