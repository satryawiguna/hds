"use client";

import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { TaskList } from "@/components/organisms/TaskList";

export default function TasksPage() {
  return (
    <DashboardLayout>
      <TaskList />
    </DashboardLayout>
  );
}
