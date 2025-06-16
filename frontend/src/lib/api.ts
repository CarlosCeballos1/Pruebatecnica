import axios, { AxiosInstance } from 'axios';
import { AuthResponse, Project, Task, User, Comment, ApiError, CreateTaskData, UpdateTaskData } from '@/types';

const baseURL = '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Esto es crucial para enviar y recibir cookies
});

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Error en la petición:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // En lugar de redirigir directamente, propagamos el error
      // El componente que maneja la petición decidirá qué hacer
      return Promise.reject(error);
    }
    
    // Para otros errores, los propagamos también
    return Promise.reject(error);
  }
);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', { email, password });
    // El token ahora se establece como una cookie HttpOnly por el backend, no lo guardamos aquí
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/register', { email, password, name });
    // El token ahora se establece como una cookie HttpOnly por el backend, no lo guardamos aquí
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    // La cookie se borra en el backend, y el navegador la elimina automáticamente
  }

  // Projects endpoints
  async getProjects(): Promise<Project[]> {
    const response = await this.client.get<Project[]>('/projects');
    return response.data;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await this.client.post<Project>('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.client.put<Project>(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  // Tasks endpoints
  async getTasks(): Promise<Task[]> {
    const response = await this.client.get<Task[]>('/tasks');
    return response.data;
  }

  async createTask(task: CreateTaskData): Promise<Task> {
    const response = await this.client.post<Task>('/tasks', task);
    return response.data;
  }

  async updateTask(id: string, task: UpdateTaskData): Promise<Task> {
    const response = await this.client.patch<Task>(`/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  // Comments endpoints
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await this.client.get<Comment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  }

  async addComment(taskId: string, content: string): Promise<Comment> {
    const response = await this.client.post<Comment>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>('/users');
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }
}

export const apiClientInstance = new ApiClient(); 