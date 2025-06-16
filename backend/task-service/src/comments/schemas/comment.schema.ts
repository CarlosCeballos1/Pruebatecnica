import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true })
  task: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment); 