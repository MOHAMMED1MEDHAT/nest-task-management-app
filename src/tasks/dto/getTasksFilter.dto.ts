import { TaskStatus } from '../models';

export class GetTasksFilterDto {
	status: TaskStatus;
	search: string;
}
