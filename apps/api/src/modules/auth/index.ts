import { Router } from "express";
import router from "./routes";

export const authModule: { path: string; router: Router } = {
  path: "/auth",
  router,
};
