import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskStatus } from '../enums/tast-status.enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.taskId = ret._id;
      delete ret._id;
    },
  },
})
export class Task {
  @Prop({ type: String })
  taskId: string;

  @Prop({ required: true, trim: true })
  filePath: string;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: String, default: null })
  error?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
