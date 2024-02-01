import { IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../models';

export class TaskDto {
	@IsString()
	title: string;
	@IsString()
	description: string;

	@IsEnum(TaskStatus)
	status: TaskStatus;
}
