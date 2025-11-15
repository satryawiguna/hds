import { Router } from "express";
import { authModule } from "./auth";
import { userModule } from "./user";
import { taskModule } from "./task";

interface Module {
  path: string;
  router: Router;
}

export const modules: Module[] = [authModule, userModule, taskModule];
