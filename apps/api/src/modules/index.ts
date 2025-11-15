import { Router } from "express";
import { authModule } from "./auth";
import { userModule } from "./user";

interface Module {
  path: string;
  router: Router;
}

export const modules: Module[] = [authModule, userModule];
