import { Request, Response, NextFunction } from "express";
import { db } from "../../../config/database.config";
import { TaskRepository } from "@hds/infrastructure";
import {
  CreateTaskUseCase,
  GetAllTasksUseCase,
  GetTaskByIdUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
} from "@hds/core";
import { successResponse } from "../../../utils/response";
import { paginate } from "../../../utils/pagination";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
} from "@hds/shared";

const taskRepository = new TaskRepository(db);

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);

export class TaskController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthRequest;
      const validatedData = await createTaskSchema.validate(req.body, {
        abortEarly: false,
      });

      const task = await createTaskUseCase.execute(
        validatedData.title,
        validatedData.description,
        authReq.user!.id,
        validatedData.status
      );

      res.status(201).json(
        successResponse(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdBy: task.createdBy,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          },
          "Task created successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = await getTasksQuerySchema.validate(req.query, {
        abortEarly: false,
      });

      const filters = {
        key: query.key,
        status: query.status,
      };

      const { tasks, total } = await getAllTasksUseCase.execute(
        query.page,
        query.limit,
        filters
      );

      const formattedTasks = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      }));

      if (query.page && query.limit) {
        const paginatedResponse = paginate(formattedTasks, total, query);
        res.json(successResponse(paginatedResponse));
      } else {
        res.json(successResponse({ data: formattedTasks, total }));
      }
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const task = await getTaskByIdUseCase.execute(id);

      res.json(
        successResponse({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          createdBy: task.createdBy,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = await updateTaskSchema.validate(req.body, {
        abortEarly: false,
      });

      const task = await updateTaskUseCase.execute(id, validatedData);

      res.json(
        successResponse(
          {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            createdBy: task.createdBy,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          },
          "Task updated successfully"
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await deleteTaskUseCase.execute(id);

      res.json(successResponse(null, "Task deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
