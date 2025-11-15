"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { TaskForm } from "@/components/molecules/TaskForm";
import { useTask, useUpdateTask } from "@/hooks/useTask";
import { UpdateTaskFormData } from "@hds/shared";
import { TASK_ROUTES } from "@hds/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { Alert, AlertDescription } from "@/components/atoms/Alert";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const { data: task, isLoading, error } = useTask(taskId);
  const updateTaskMutation = useUpdateTask(taskId);

  const handleSubmit = async (data: UpdateTaskFormData) => {
    await updateTaskMutation.mutateAsync(data);
    router.push(TASK_ROUTES.LIST);
  };

  const handleCancel = () => {
    router.push(TASK_ROUTES.LIST);
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
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              mode="edit"
              defaultValues={{
                title: task.title,
                description: task.description,
                status: task.status,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={updateTaskMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
