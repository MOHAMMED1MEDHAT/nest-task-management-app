import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../enums';

export class GetTasksFilterDto {
	@IsOptional()
	@IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
	status: TaskStatus;

	@IsOptional()
	@IsNotEmpty()
	search: string;
}
