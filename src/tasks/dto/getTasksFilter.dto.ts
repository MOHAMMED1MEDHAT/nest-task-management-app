import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

type SortOrder = 'ASC' | 'DESC';
export class GetTasksFilterDto {
	search: string;

	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;

	@IsOptional()
	@IsString()
	@IsIn(['title', 'description', 'status'])
	fields: string[];

	@IsOptional()
	@IsString()
	@IsIn(['title', 'description', 'status'])
	sortBy: string;

	@IsOptional()
	@IsIn(['ASC', 'DESC'])
	sortOrder: SortOrder;
}
