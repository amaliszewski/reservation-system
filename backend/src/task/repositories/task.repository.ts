import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async createTask(data: Partial<Task>) {
    const newTask = await this.taskModel.create(data);

    return newTask.save();
  }

  async updateOne(field: string, value: string, data: Partial<Task>) {
    return await this.taskModel.findOneAndUpdate({ [field]: value }, data, {
      new: true,
    });
  }

  async findById(taskId: string, select: string[]) {
    return await this.taskModel.findById(taskId).select(select);
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find();
  }
}
