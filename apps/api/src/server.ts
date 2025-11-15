import express, { Express, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { modules } from "./modules";

export const createServer = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  app.use(loggerMiddleware);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  const apiRouter = Router();
  modules.forEach((module) => {
    apiRouter.use(module.path, module.router);
  });

  app.use("/api/v1", apiRouter);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
};
