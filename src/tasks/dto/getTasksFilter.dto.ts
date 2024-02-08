import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;

	@IsOptional()
	@IsString()
	@IsIn(['title', 'description', 'status'])
	fields: string;

	@IsOptional()
	@IsString()
	@IsIn(['title', 'description', 'status'])
	sortBy: string;

	@IsOptional()
	@IsIn(['asc', 'desc'])
	sortOrder: string;
}
