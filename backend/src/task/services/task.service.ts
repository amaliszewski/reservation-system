import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from '../repositories/task.repository';
import { QueueService } from 'src/queue/service/queue.service';
import { Task } from '../schemas/task.schema';
import { TaskStatus } from '../enums/tast-status.enum';
import { TaskGateway } from '../gateways/task.gateway';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly taskRepository: TaskRepository,
    private readonly taskGateway: TaskGateway,
  ) {}

  async createTask(filePath: string): Promise<string> {
    try {
      const newTask = await this.taskRepository.createTask({ filePath });
      this.taskGateway.taskCreated(newTask);
      await this.queueService.addToQueue(newTask);

      return newTask.id;
    } catch (error) {
      this.logger.error('Failed to create task', error.stack);
      throw new BadRequestException('Failed to create task');
    }
  }

  async updateStatus(taskId: string, status: TaskStatus) {
    try {
      const updatedTask = await this.taskRepository.updateOne('_id', taskId, {
        status,
      });

      console.log('asasd');

      this.taskGateway.taskUpdated(updatedTask);
    } catch (error) {
      this.logger.error('Failed to update task', error.stack);
      throw new BadRequestException('Failed to update task');
    }
  }
  async getTask(taskId: string): Promise<Task> {
    try {
      return this.taskRepository.findById(taskId, ['status']);
    } catch (error) {
      this.logger.error('Task does not exist', error.stack);
      throw new NotFoundException('Task does not exist');
    }
  }

  async getAllTasks() {
    try {
      return this.taskRepository.findAll();
    } catch (error) {
      this.logger.error('Failed to get tasks', error.stack);
      throw new NotFoundException('Failed to get tasks');
    }
  }

  async addError(taskId: string, error: string): Promise<void> {
    try {
      await this.taskRepository.updateOne('_id', taskId, { error });
    } catch (error) {
      this.logger.error('Failed to add error', error.stack);
      throw new BadRequestException('Failed to add error');
    }
  }

  async getError(taskId: string): Promise<Partial<Task>> {
    try {
      return this.taskRepository.findById(taskId, ['error']);
    } catch (error) {
      this.logger.error('Failed to get error', error.stack);
      throw new NotFoundException('Failed to get error');
    }
  }
}
