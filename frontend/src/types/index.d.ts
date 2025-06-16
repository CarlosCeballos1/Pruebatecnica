export type BackendTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type FrontendTaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  // Add any other user properties
}

export interface Project {
  id: string;
  name: string;
  // Add any other project properties
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: BackendTaskStatus | FrontendTaskStatus;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdAt?: string;
  assignee?: User | string; // Allow User object or string ID, and optional
  project?: Project | string; // Allow Project object or string ID, and optional
  // Add any other properties that tasks might have in your application
} 