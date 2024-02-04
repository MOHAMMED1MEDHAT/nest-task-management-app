import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../enums';

export class TaskStatusValidationPipe implements PipeTransform {
	readonly allowedStatusMap = {
		DONE: TaskStatus.DONE,
		IN_PROGRESS: TaskStatus.IN_PROGRESS,
		OPEN: TaskStatus.OPEN,
	};

	private isStatusValid(status: string): boolean {
		const value = this.allowedStatusMap[status];
		return !value ? false : true;
	}

	transform(value: string): string {
		value = value.toUpperCase();
		if (!this.isStatusValid(value))
			throw new BadRequestException(`"${value} is not valid"`);
		return value;
	}
}
