import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
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
    try {
      const user = await this.userService.findOne(createTaskDto.assigneeId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const task = this.tasksRepository.create({
        ...createTaskDto,
        assignee: user
      });

      const savedTask = await this.tasksRepository.save(task);
      return savedTask;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
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
    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask = await this.tasksRepository.save({
      ...task,
      ...updateTaskDto
    });

    return updatedTask;
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