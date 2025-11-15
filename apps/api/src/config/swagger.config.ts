import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { env } from "./env.config";

const getSourcePath = () => {
  if (__dirname.includes("dist")) {
    return path.resolve(__dirname, "../../src");
  }

  return path.resolve(__dirname, "..");
};

const sourcePath = getSourcePath();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HDS API Documentation",
      version: "1.0.0",
      description: "Happy Day Services API documentation",
      contact: {
        name: "HDS Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api/v1`,
        description: "Development server",
      },
      {
        url: "https://api.happydayservices.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            statusCode: {
              type: "number",
              example: 400,
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Health",
        description: "Health check endpoints",
      },
    ],
  },

  apis: [
    path.join(sourcePath, "server.ts"),
    path.join(sourcePath, "modules/**/routes/*.ts"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
