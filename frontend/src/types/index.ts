export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  team?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  members: string[];
  createdAt: Date;
  deadline?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee?: User;
  project?: Project;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'comment' | 'assignment' | 'deadline' | 'status_change';
  message: string;
  read: boolean;
  createdAt: Date;
  relatedTask?: Task;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  assigneeId?: string;
  projectId?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
} 