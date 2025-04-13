import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { QueueService } from './service/queue.service';
import { ReservationWorker } from './workers/reservation.worker';
import { ProcessFileService } from './service/process-file.service';
import { ReservationModule } from 'src/reservation/reservation.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    ReservationModule,
    forwardRef(() => TaskModule),
    BullModule.registerQueue({ name: 'reservation' }),
  ],
  providers: [QueueService, ReservationWorker, ProcessFileService],
  exports: [QueueService],
})
export class QueueModule {}
