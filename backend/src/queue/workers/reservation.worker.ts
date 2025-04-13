import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProcessFileService } from '../service/process-file.service';
import { TaskService } from 'src/task/services/task.service';
import { TaskStatus } from 'src/task/enums/tast-status.enum';

@Processor('reservation')
export class ReservationWorker extends WorkerHost {
  constructor(
    private readonly processFileService: ProcessFileService,
    private readonly taskService: TaskService,
  ) {
    super();
  }

  async process(job: Job) {
    this.processFileService.processFile(job.data);
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    const taskId = job.data.taskId;
    await this.taskService.updateStatus(taskId, TaskStatus.IN_PROGRESS);
  }

  @OnWorkerEvent('completed')
  async onComplete(job: Job) {
    const taskId = job.data.taskId;
    await this.taskService.updateStatus(taskId, TaskStatus.COMPLETED);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const taskId = job.data.taskId;
    await this.taskService.updateStatus(taskId, TaskStatus.FAILED);
  }
}
