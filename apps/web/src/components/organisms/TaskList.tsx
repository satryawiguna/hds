"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TaskStatus, TASK_CONSTANTS, TASK_ROUTES } from "@hds/shared";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { DataTable, Column } from "@/components/molecules/DataTable";
import { TaskFilters } from "@/components/molecules/TaskFilters";
import {
  Task,
  useTasks,
  useDeleteTask,
  useUpdateTaskStatus,
} from "@/hooks/useTask";
import { Eye, Pencil, Trash2 } from "lucide-react";

export const TaskList: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState("");
  const [searchKey, setSearchKey] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "">("");
  const [currentPage, setCurrentPage] = React.useState<number>(
    TASK_CONSTANTS.DEFAULT_PAGE
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKey(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useTasks({
    key: searchKey,
    status: statusFilter || undefined,
    page: currentPage,
    limit: TASK_CONSTANTS.DEFAULT_LIMIT,
  });

  const deleteTaskMutation = useDeleteTask();
  const updateStatusMutation = useUpdateTaskStatus();

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleStatusChange = React.useCallback((value: TaskStatus | "") => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleView = React.useCallback(
    (task: Task) => {
      router.push(TASK_ROUTES.VIEW(task.id));
    },
    [router]
  );

  const handleEdit = React.useCallback(
    (task: Task) => {
      router.push(TASK_ROUTES.EDIT(task.id));
    },
    [router]
  );

  const handleDeleteClick = React.useCallback((task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = React.useCallback(async () => {
    if (taskToDelete) {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  }, [taskToDelete, deleteTaskMutation]);

  const handleStatusUpdate = React.useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      await updateStatusMutation.mutateAsync({ id: taskId, status: newStatus });
    },
    [updateStatusMutation]
  );

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TO_DO:
        return <Badge variant="default">{status}</Badge>;
      case TaskStatus.IN_PROGRESS:
        return <Badge variant="primary">{status}</Badge>;
      case TaskStatus.DONE:
        return <Badge variant="success">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Title",
      render: (task) => (
        <div className="font-medium text-gray-900">{task.title}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (task) => (
        <div className="max-w-md truncate text-gray-600">
          {task.description}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task) => getStatusBadge(task.status),
      className: "w-32",
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (task) => (
        <div className="text-gray-600">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      ),
      className: "w-32",
    },
    {
      key: "actions",
      header: "Actions",
      render: (task) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleView(task)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(task)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteClick(task)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
          {task.status !== TaskStatus.DONE && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleStatusUpdate(
                  task.id,
                  task.status === TaskStatus.TO_DO
                    ? TaskStatus.IN_PROGRESS
                    : TaskStatus.DONE
                )
              }
            >
              {task.status === TaskStatus.TO_DO ? "Start" : "Complete"}
            </Button>
          )}
        </div>
      ),
      className: "w-64",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Manage your tasks</p>
        </div>
        <Button onClick={() => router.push(TASK_ROUTES.NEW)}>
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        searchValue={searchInput}
        statusValue={statusFilter}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={
          data?.meta
            ? {
                currentPage: data.meta.page,
                totalPages: data.meta.totalPages,
                totalItems: data.meta.total,
                pageSize: data.meta.limit,
              }
            : undefined
        }
        onPageChange={handlePageChange}
        isLoading={isLoading}
        emptyMessage="No tasks found"
        keyExtractor={(task) => task.id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{taskToDelete?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteTaskMutation.isPending}
              className="text-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              isLoading={deleteTaskMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
