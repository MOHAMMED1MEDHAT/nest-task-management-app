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

	@Get()
	getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
		return this.tasksService.getAllTasks(filterDto);
	}

	@Post()
	createTask(@Body() taskDto: TaskDto): Promise<Task> {
		return this.tasksService.createTask(taskDto);
	}

	@Get('/:id')
	getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
		return this.tasksService.getTaskById(id);
	}

	// @Patch('/:id')
	// updateTaskById(@Param('id') id: string, @Body() taskDto: TaskDto): Task {
	// 	return this.tasksService.updateTaskById(id, taskDto);
	// }

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, status);
	}

	@Delete('/:id')
	deleteTaskById(@Param('id', ParseIntPipe) id: number): Promise<void> {
		return this.tasksService.deleteTaskById(id);
	}
}
