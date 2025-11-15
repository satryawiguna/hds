import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";

export const swaggerAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Documentation"');
    res.status(401).json({
      status: "error",
      message: "Authentication required to access API documentation",
    });
    return;
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );
    const [username, password] = credentials.split(":");

    if (username === env.swagger.user && password === env.swagger.password) {
      next();
    } else {
      res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Documentation"');
      res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Documentation"');
    res.status(401).json({
      status: "error",
      message: "Invalid authentication format",
    });
  }
};
