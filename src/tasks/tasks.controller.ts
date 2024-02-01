import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './models';
import { GetTasksFilterDto, TaskDto } from './dto';
import { TaskStatusValidationPipe } from './pipes';

@Controller('tasks')
export class TasksController {
	constructor(private tasksService: TasksService) {}

	@Get()
	getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
		if (Object.keys(filterDto).length) {
			return this.tasksService.getTasksWithFilters(filterDto);
		}
		return this.tasksService.getAllTasks();
	}

	@Post()
	createTask(@Body() taskDto: TaskDto): Task {
		return this.tasksService.createTask(taskDto);
	}

	@Get('/:id')
	getTaskById(@Param('id') id: string): Task {
		return this.tasksService.getTaskById(id);
	}

	@Patch('/:id')
	updateTaskById(@Param('id') id: string, @Body() taskDto: TaskDto): Task {
		return this.tasksService.updateTaskById(id, taskDto);
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
	): Task {
		return this.tasksService.updateTaskStatus(id, status);
	}

	@Delete('/:id')
	deleteTaskById(@Param('id') id: string): void {
		this.tasksService.deleteTaskById(id);
	}
}
