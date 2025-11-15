export const TASK_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const TASK_ROUTES = {
  LIST: "/dashboard/tasks",
  NEW: "/dashboard/tasks/new",
  EDIT: (id: string) => `/dashboard/tasks/${id}/edit`,
  VIEW: (id: string) => `/dashboard/tasks/${id}`,
} as const;

export const TASK_QUERY_KEYS = {
  TASKS: ["tasks"],
  TASK: (id: string) => ["tasks", id],
  TASKS_LIST: (filters: Record<string, unknown>) => ["tasks", "list", filters],
} as const;
