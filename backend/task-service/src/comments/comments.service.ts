import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      author: authorId,
      task: { id: createCommentDto.task }
    });
    return this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['task']
    });
  }

  async findOne(id: string): Promise<Comment> {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['task']
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    if (!comment) {
      return null;
    }

    const updateData: Partial<Comment> = {};
    if (updateCommentDto.content) updateData.content = updateCommentDto.content;
    if (updateCommentDto.task) updateData.task = { id: updateCommentDto.task } as any;

    await this.commentsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { task: { id: taskId } },
      relations: ['task']
    });
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { author: authorId },
      relations: ['task']
    });
  }
} 