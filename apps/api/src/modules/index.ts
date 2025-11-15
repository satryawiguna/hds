import { Router } from "express";

interface Module {
  path: string;
  router: Router;
}

export const modules: Module[] = [];
