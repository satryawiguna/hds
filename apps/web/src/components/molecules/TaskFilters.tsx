"use client";

import * as React from "react";
import { TaskStatus } from "@hds/shared";
import { SearchInput } from "@/components/atoms/SearchInput";
import { Select, SelectOption } from "@/components/atoms/Select";
import { Label } from "@/components/atoms/Label";

export interface TaskFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  searchValue?: string;
  statusValue?: TaskStatus | "";
}

const statusOptions: SelectOption[] = [
  { value: "", label: "All Status" },
  { value: TaskStatus.TO_DO, label: "To Do" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.DONE, label: "Done" },
];

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onSearchChange,
  onStatusChange,
  searchValue = "",
  statusValue = "",
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label>Search</Label>
        <SearchInput
          placeholder="Search by title..."
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchValue}
          className="text-gray-800"
        />
      </div>
      <div className="w-full sm:w-48">
        <Label>Status</Label>
        <Select
          options={statusOptions}
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
          className="text-gray-800 px-2"
        />
      </div>
    </div>
  );
};
