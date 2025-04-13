import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Task } from 'src/task/schemas/task.schema';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('reservation') private readonly reservationQueue: Queue,
  ) {}

  async addToQueue(newTask: Partial<Task>) {
    await this.reservationQueue.add('process', newTask, { delay: 5000 });
  }
}
