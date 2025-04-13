import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { QueueService } from 'src/queue/service/queue.service';
import { TaskRepository } from '../repositories/task.repository';
import { BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../enums/tast-status.enum';
import { TaskGateway } from '../gateways/task.gateway';

describe('TaskService', () => {
  let service: TaskService;
  let queueService: jest.Mocked<QueueService>;
  let taskRepository: jest.Mocked<TaskRepository>;
  let taskGateway: jest.Mocked<TaskGateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: QueueService,
          useValue: {
            addToQueue: jest.fn(),
          },
        },
        {
          provide: TaskRepository,
          useValue: {
            createTask: jest.fn(),
            updateOne: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: TaskGateway,
          useValue: {
            taskCreated: jest.fn(),
            taskUpdated: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    queueService = module.get(QueueService);
    taskRepository = module.get(TaskRepository);
    taskGateway = module.get(TaskGateway);
  });

  describe('createTask', () => {
    it('should create a task and add it to the queue', async () => {
      const task = { id: 'task123' };
      taskRepository.createTask.mockResolvedValue(task as any);

      const result = await service.createTask('file.xlsx');

      expect(taskRepository.createTask).toHaveBeenCalledWith({
        filePath: 'file.xlsx',
      });
      expect(queueService.addToQueue).toHaveBeenCalledWith(task);
      expect(result).toBe('task123');
    });

    it('should throw BadRequestException on failure', async () => {
      taskRepository.createTask.mockRejectedValue(new Error('db error'));

      await expect(service.createTask('file.xlsx')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      await service.updateStatus('task123', TaskStatus.COMPLETED);

      expect(taskRepository.updateOne).toHaveBeenCalledWith('_id', 'task123', {
        status: TaskStatus.COMPLETED,
      });
    });

    it('should throw BadRequestException on failure', async () => {
      taskRepository.updateOne.mockRejectedValue(new Error('update error'));

      await expect(
        service.updateStatus('task123', TaskStatus.FAILED),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTask', () => {
    it('should return the task if found', async () => {
      const task = { id: 'task123', filePath: 'file.xlsx' };
      taskRepository.findById.mockResolvedValue(task as any);

      const result = await service.getTask('task123');

      expect(result).toEqual(task);
    });
  });
});
