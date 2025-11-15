"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { TaskForm } from "@/components/molecules/TaskForm";
import { useCreateTask } from "@/hooks/useTask";
import { TASK_ROUTES } from "@hds/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import { useAuthStore } from "@/lib/store";
import { CreateTaskFormData, UpdateTaskFormData } from "@hds/shared";

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (
    data: CreateTaskFormData | UpdateTaskFormData
  ) => {
    if (!user?.id) return;

    await createTaskMutation.mutateAsync({
      ...(data as CreateTaskFormData),
      createdBy: user.id,
    });
    router.push(TASK_ROUTES.LIST);
  };

  const handleCancel = () => {
    router.push(TASK_ROUTES.LIST);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              mode="create"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={createTaskMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
