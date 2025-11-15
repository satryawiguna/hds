import { Router } from "express";
import router from "./routes";

export const userModule: { path: string; router: Router } = {
  path: "/users",
  router,
};
