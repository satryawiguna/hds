import { createServer } from "./server";
import { env } from "./config/env.config";
import { logger } from "./config/logger.config";
import { db } from "./config/database.config";

const startServer = async () => {
  try {
    await db.raw("SELECT 1");
    logger.info("Database connection established");

    const app = createServer();

    app.listen(env.port, () => {
      logger.info(`Server is running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
