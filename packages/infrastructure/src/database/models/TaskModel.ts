export interface TaskModel {
  id: string;
  title: string;
  description: string;
  status: "to do" | "in progress" | "done";
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
