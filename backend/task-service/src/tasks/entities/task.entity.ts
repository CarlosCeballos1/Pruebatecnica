import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from '@task-service/projects/entities/project.entity';
import { Comment } from '@task-service/comments/entities/comment.entity';

// Interfaz para el usuario asignado
export interface User {
  id: string;
  email: string;
  name: string;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'uuid', nullable: true, name: 'assignedTo' })
  assignedTo: string;

  assignee?: User;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @Column({ type: 'uuid' })
  projectId: string;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 