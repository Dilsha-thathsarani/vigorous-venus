// src/types/index.ts
export interface Task {
  id: string;
  title: string;
  description?: string | null | undefined;
  column_id: string;
  order_index: number;
  assignee_id: string | null;
  task_window_start: string | null;
  task_window_deadline: string | null;
  priority?: "low" | "medium" | "high" | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Additional fields for relations
  assignee?: {
    full_name: string;
  };
}

export interface Column {
  tasks: any;
  id: string;
  board_id: string;
  title: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  items: Task[];
}

// Interface for the organized columns
export interface OrganizedColumn {
  id: string;
  title: string;
  board_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  items: Task[];
}

export interface TaskColumn extends Column {
  items: Task[];
}

export interface Board {
  id: string;
  workspace_id: string;
  name: string;
  description?: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Workspace {
  icon: string;
  organization_id: string;
  id: string;
  name: string;
  description?: string | null | undefined;
  created_by: string; // Added as per schema
  created_at: Date;
  updated_at: Date;
}

// Additional types to match schema
export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskHistory {
  id: string;
  task_id: string;
  user_id: string;
  action_type: string;
  old_value?: any;
  new_value?: any;
  created_at: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  workspace_id: string;
  created_at: Date;
}
export interface Task {
  id: string;
  title: string;
  description?: string | null | undefined;
  assignee?: {
    full_name: string;
  };
  taskWindowStart?: string;
  taskWindowDeadline?: string;
  priority?: "low" | "medium" | "high" | null;
  column_id: string;
}

export interface Column {
  id: string;
  title: string;
  items: Task[];
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceFormData {
  organization_id: string; // Matches database column
  name: string; // Matches database column
  description?: string; // Optional
  icon: string;
}

export interface OrganizationFormData {
  name: string;
  description: string;
}
