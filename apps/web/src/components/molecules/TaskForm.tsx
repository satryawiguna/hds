"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TaskStatus } from "@hds/shared";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Select, SelectOption } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import { FormGroup } from "@/components/molecules/FormGroup";
import {
  createTaskSchema,
  updateTaskSchema,
  CreateTaskFormData,
  UpdateTaskFormData,
} from "@/validators/task.validators";

export interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CreateTaskFormData | UpdateTaskFormData>;
  onSubmit: (data: CreateTaskFormData | UpdateTaskFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const statusOptions: SelectOption[] = [
  { value: TaskStatus.TO_DO, label: "To Do" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.DONE, label: "Done" },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData | UpdateTaskFormData>({
    resolver: yupResolver(
      mode === "create" ? createTaskSchema : updateTaskSchema
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: defaultValues || {
      title: "",
      description: "",
      status: TaskStatus.TO_DO,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormGroup label="Title" error={errors.title?.message} required>
        <Input
          type="text"
          placeholder="Enter task title"
          error={errors.title?.message}
          {...register("title")}
        />
      </FormGroup>

      <FormGroup
        label="Description"
        error={errors.description?.message}
        required
      >
        <Textarea
          placeholder="Enter task description"
          error={errors.description?.message}
          rows={5}
          {...register("description")}
        />
      </FormGroup>

      <FormGroup label="Status" error={errors.status?.message}>
        <Select
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
      </FormGroup>

      <div className="flex items-center justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-gray-800"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Create Task" : "Update Task"}
        </Button>
      </div>
    </form>
  );
};
