import { Logger, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
	TypeOrmModule,
	getDataSourceToken,
	getRepositoryToken,
} from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { customTaskRepository } from './repositories/task.repository';
import { Task } from './task.entity';
import { AuthModule } from './../auth/auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Task]), AuthModule],
	controllers: [TasksController],
	providers: [
		{
			provide: getRepositoryToken(Task),
			inject: [getDataSourceToken()],
			useFactory(dataSource: DataSource): any {
				return dataSource.getRepository(Task).extend(customTaskRepository);
			},
		},
		TasksService,
		Logger,
	],
})
export class TasksModule {}
