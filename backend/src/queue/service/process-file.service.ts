import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ReservationDto } from 'src/reservation/dto/reservation.dto';
import { Reservation } from 'src/reservation/schemas/reservation.schema';
import { ReservationService } from 'src/reservation/services/reservation.service';
import { TaskStatus } from 'src/task/enums/tast-status.enum';
import { Task } from 'src/task/schemas/task.schema';
import { TaskService } from 'src/task/services/task.service';

@Injectable()
export class ProcessFileService {
  private readonly logger = new Logger(ProcessFileService.name);

  constructor(
    private readonly reservationService: ReservationService,
    private readonly taskService: TaskService,
  ) {}

  async processFile({ filePath, taskId }: Task): Promise<void> {
    this.logger.log(`Starting file processing for taskId: ${taskId}`);

    const workbook = await this.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const errors = [];

    const rows = worksheet.getRows(2, worksheet.rowCount - 1) || [];
    this.logger.debug(`Found ${rows.length} rows in the file.`);

    for (const row of rows) {
      const dto = this.mapRowToDto(row);

      const validationErrors = await validate(dto);

      if (validationErrors.length > 0) {
        this.handleValidationError(validationErrors, row, errors);
        continue;
      }

      try {
        const isFinalStatus = ['zrealizowana', 'anulowana'].includes(
          dto.status,
        );

        if (isFinalStatus) {
          const existingReservation = await this.findExistingReservation(dto);

          if (existingReservation) {
            await this.updateExistingReservation(existingReservation, dto);
            continue;
          }
        } else {
          await this.createOrUpdateReservation(dto);
        }
      } catch (error) {
        this.handleDatabaseError(error, row, errors);
      }
    }

    if (errors.length) {
      this.logger.error(
        `Errors encountered during processing: ${JSON.stringify(errors)}`,
      );
      await this.taskService.addError(taskId, JSON.stringify(errors));
      await this.taskService.updateStatus(taskId, TaskStatus.FAILED);
    }

    this.logger.log(
      `File processing completed successfully for taskId: ${taskId}`,
    );
  }

  private async readFile(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    const stream = fs.createReadStream(filePath);
    await workbook.xlsx.read(stream);

    return workbook;
  }

  private mapRowToDto(row: any): ReservationDto {
    return plainToInstance(ReservationDto, {
      reservation_id: String(row.getCell(1).value),
      guest_name: String(row.getCell(2).value),
      status: String(row.getCell(3).value),
      check_in_date: new Date(row.getCell(4).value as string)
        .toISOString()
        .split('T')[0],
      check_out_date: new Date(row.getCell(5).value as string)
        .toISOString()
        .split('T')[0],
    });
  }

  private handleValidationError(
    validationErrors: any[],
    row: any,
    errors: any[],
  ) {
    errors.push({
      row: row.number,
      reason: 'Validation failed',
      details: validationErrors
        .map((e) => Object.values(e.constraints || {}).join(', '))
        .join('; '),
      suggestion: 'Verify data and fix errors',
    });
  }

  private async findExistingReservation({ reservation_id }: ReservationDto) {
    return await this.reservationService.findByReservationId(reservation_id);
  }

  private async updateExistingReservation(
    existing: Reservation,
    dto: ReservationDto,
  ) {
    await this.reservationService.createOrUpdateReservation(
      existing.reservation_id,
      {
        status: dto.status,
      },
    );
  }

  private async createOrUpdateReservation(dto: ReservationDto) {
    await this.reservationService.createOrUpdateReservation(
      dto.reservation_id,
      dto,
    );
  }

  private handleDatabaseError(err: any, row: any, errors: any[]) {
    errors.push({
      row: row.number,
      reason: 'Database error',
      details: err.message,
      suggestion: 'Check unique ID nad database connection.',
    });
  }
}
