import express, { Express, Router } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { swaggerAuthMiddleware } from "./middlewares/swagger-auth.middleware";
import { modules } from "./modules";
import { swaggerSpec } from "./config/swagger.config";
import { env } from "./config/env.config";

export const createServer = (): Express => {
  const app = express();

  // Security middleware (with exemptions for Swagger UI)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Swagger UI to work
    })
  );

  // CORS configuration - allow credentials and specific origins
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Set-Cookie"],
    })
  );

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  app.use(loggerMiddleware);

  // Health check endpoint
  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     summary: Health check endpoint
   *     description: Returns the health status of the API
   *     security: []
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   */
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Swagger documentation routes (protected with basic auth)
  app.use(
    "/api-docs",
    swaggerAuthMiddleware,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "HDS API Documentation",
    })
  );

  // Swagger JSON endpoint (also protected)
  app.get("/api-docs.json", swaggerAuthMiddleware, (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
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
