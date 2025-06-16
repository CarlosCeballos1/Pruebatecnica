export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
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
  projectId: string;
  status?: TaskStatus;
  assignedTo?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  projectId?: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
} 