"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TaskStatus,
  TaskFilters,
  CreateTaskDTO,
  UpdateTaskDTO,
  API_ENDPOINTS,
  TASK_QUERY_KEYS,
} from "@hds/shared";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useTasks = (filters: TaskFilters) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.TASKS_LIST(filters as Record<string, unknown>),
    queryFn: async (): Promise<TasksResponse> => {
      const params = new URLSearchParams();
      if (filters.key) params.append("key", filters.key);
      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await apiClient.get(
        `${API_ENDPOINTS.TASK.BASE}?${params.toString()}`
      );

      const apiData = response.data.data;

      return {
        data: apiData.data,
        meta: {
          page: apiData.pagination.page,
          limit: apiData.pagination.limit,
          total: apiData.pagination.total,
          totalPages: apiData.pagination.totalPages,
        },
      };
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.TASK(id),
    queryFn: async (): Promise<Task> => {
      const response = await apiClient.get(API_ENDPOINTS.TASK.BY_ID(id));
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskDTO): Promise<Task> => {
      const response = await apiClient.post(API_ENDPOINTS.TASK.BASE, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.TASKS });
      toast.success("Task created successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTaskDTO): Promise<Task> => {
      const response = await apiClient.put(API_ENDPOINTS.TASK.BY_ID(id), data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.TASK(id) });
      toast.success("Task updated successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(API_ENDPOINTS.TASK.BY_ID(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.TASKS });
      toast.success("Task deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: TaskStatus;
    }): Promise<Task> => {
      const response = await apiClient.put(API_ENDPOINTS.TASK.BY_ID(id), {
        status,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.TASKS });
      toast.success("Task status updated successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    },
  });
};
