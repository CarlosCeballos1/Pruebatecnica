import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async enrichTaskWithUserData(task: Task): Promise<Task> {
    if (task.assignedTo) {
      try {
        const response = await this.httpService.axiosRef.get(
          `${this.configService.get('AUTH_SERVICE_URL')}/api/users/${task.assignedTo}`,
        );
        task.assignee = response.data;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    return task;
  }

  private async enrichTasksWithUserData(tasks: Task[]): Promise<Task[]> {
    return Promise.all(tasks.map(task => this.enrichTaskWithUserData(task)));
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);
    return this.enrichTaskWithUserData(savedTask);
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      relations: ['project'],
    });
    return this.enrichTasksWithUserData(tasks);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.enrichTaskWithUserData(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);
    return this.enrichTaskWithUserData(updatedTask);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { projectId },
      relations: ['project'],
    });
    return this.enrichTasksWithUserData(tasks);
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { assignedTo: assigneeId },
      relations: ['project'],
    });
    return this.enrichTasksWithUserData(tasks);
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { status },
      relations: ['project'],
    });
    return this.enrichTasksWithUserData(tasks);
  }
}