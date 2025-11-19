export interface ProjectModel {
  id: string;
  title: string;
  description: string;
  status: "active" | "archive" | "pending";
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
