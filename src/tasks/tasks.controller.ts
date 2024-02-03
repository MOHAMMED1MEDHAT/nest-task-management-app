import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './enums';
import { GetTasksFilterDto, TaskDto } from './dto';
import { TaskStatusValidationPipe } from './pipes';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
	constructor(private tasksService: TasksService) {}

	// @Get()
	// getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
	// 	if (Object.keys(filterDto).length) {
	// 		return this.tasksService.getTasksWithFilters(filterDto);
	// 	}
	// 	return this.tasksService.getAllTasks();
	// }

	// @Post()
	// createTask(@Body() taskDto: TaskDto): Task {
	// 	return this.tasksService.createTask(taskDto);
	// }

	@Get('/:id')
	getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
		return this.tasksService.getTaskById(id);
	}

	// @Patch('/:id')
	// updateTaskById(@Param('id') id: string, @Body() taskDto: TaskDto): Task {
	// 	return this.tasksService.updateTaskById(id, taskDto);
	// }

	// @Patch('/:id/status')
	// updateTaskStatus(
	// 	@Param('id') id: string,
	// 	@Body('status', TaskStatusValidationPipe) status: TaskStatus,
	// ): Task {
	// 	return this.tasksService.updateTaskStatus(id, status);
	// }

	// @Delete('/:id')
	// deleteTaskById(@Param('id') id: string): void {
	// 	this.tasksService.deleteTaskById(id);
	// }
}
