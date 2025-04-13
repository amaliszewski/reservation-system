import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import { QueueModule } from 'src/queue/queue.module';
import { TaskGateway } from './gateways/task.gateway';

@Module({
  imports: [
    forwardRef(() => QueueModule),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskGateway],
  exports: [TaskService],
})
export class TaskModule {}
