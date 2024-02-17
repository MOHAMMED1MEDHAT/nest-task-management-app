import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './enums';
import { GetTasksFilterDto, TaskDto } from './dto';
import { TaskStatusValidationPipe } from './pipes';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
	private logger = new Logger('TasksController');
	constructor(private tasksService: TasksService) {}

	@Get()
	getTasks(
		@Query() filterDto: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		this.logger.verbose(
			`User "${user.userName}" retrieving all tasks. Filters: ${JSON.stringify(
				filterDto,
			)}`,
		);

		return this.tasksService.getAllTasks(filterDto, user);
	}

	@Post()
	createTask(@Body() taskDto: TaskDto, @GetUser() user: User): Promise<Task> {
		this.logger.verbose(
			`User "${user.userName}" creating a new task. Data: ${JSON.stringify(taskDto)}`,
		);
		return this.tasksService.createTask(taskDto, user);
	}

	@Get('/:id')
	getTaskById(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.getTaskById(id, user);
	}

	// @Patch('/:id')
	// updateTaskById(@Param('id') id: string, @Body() taskDto: TaskDto): Task {
	// 	return this.tasksService.updateTaskById(id, taskDto);
	// }

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, user, status);
	}

	@Delete('/:id')
	deleteTaskById(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<void> {
		return this.tasksService.deleteTaskById(id, user);
	}
}
