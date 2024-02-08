import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums';

export class TaskDto {
	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsOptional()
	@IsEnum(TaskStatus)
	status: TaskStatus;
}
