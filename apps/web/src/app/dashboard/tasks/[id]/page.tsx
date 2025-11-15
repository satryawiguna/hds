"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { useTask, useDeleteTask } from "@/hooks/useTask";
import { TASK_ROUTES } from "@hds/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import { TaskStatus } from "@hds/shared";
import * as React from "react";

export default function ViewTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { data: task, isLoading, error } = useTask(taskId);
  const deleteTaskMutation = useDeleteTask();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleEdit = () => {
    router.push(TASK_ROUTES.EDIT(taskId));
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteTaskMutation.mutateAsync(taskId);
    setDeleteDialogOpen(false);
    router.push(TASK_ROUTES.LIST);
  };

  const handleBack = () => {
    router.push(TASK_ROUTES.LIST);
  };

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm text-gray-600">Loading task...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl">
          <Alert>
            <AlertDescription>
              Failed to load task. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="text-gray-800"
          >
            Back to Tasks
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="text-orange-800"
            >
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDeleteClick}>
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <CardDescription>
                  Created on {new Date(task.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(task.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-600">
                  Description
                </h3>
                <p className="text-gray-900">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-gray-600">
                    Created At
                  </h3>
                  <p className="text-gray-900">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-gray-600">
                    Last Updated
                  </h3>
                  <p className="text-gray-900">
                    {new Date(task.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{task.title}&quot;? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleteTaskMutation.isPending}
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
    </DashboardLayout>
  );
}
