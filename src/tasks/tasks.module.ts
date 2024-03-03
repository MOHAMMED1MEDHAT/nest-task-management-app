import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './../auth/auth.module';
import { TaskRepository } from './repositories/task.repository';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
	imports: [TypeOrmModule.forFeature([Task]), AuthModule],
	controllers: [TasksController],
	providers: [TaskRepository, TasksService, Logger],
})
export class TasksModule {}
