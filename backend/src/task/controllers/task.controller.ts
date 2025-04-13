import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/file-upload.dto';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { TaskService } from '../services/task.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Task } from '../schemas/task.schema';

@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of reservations',
    type: FileUploadDto,
  })
  @UseGuards(JwtAuthGuard)
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.match(/\.xlsx$/)) {
      fs.unlinkSync(file.path);
      throw new BadRequestException('Only .xlsx files are allowed');
    }

    return this.taskService.createTask(file.path);
  }

  @Get()
  getAll(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  @Get('status/:taskId')
  @UseGuards(JwtAuthGuard)
  status(@Param('taskId') taskId: string) {
    return this.taskService.getTask(taskId);
  }

  @Get('report/:taskId')
  report(@Param('taskId') taskId: string) {
    return this.taskService.getError(taskId);
  }
}
