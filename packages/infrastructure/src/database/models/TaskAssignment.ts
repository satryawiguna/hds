export interface TaskAssignmentModel {
  id: string;
  task_id: string;
  user_id: string;
  project_id: string | null;
  created_at: Date;
  updated_at: Date;
}
