import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './models';
import * as uuid from 'uuid';
import { TaskDto } from './dto/task.dto';
import { GetTasksFilterDto } from './dto';

@Injectable()
export class TasksService {
	private tasks: Task[] = [];

	@Get()
	getAllTasks(): Task[] {
		return this.tasks;
	}

	getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
		const { status, search } = filterDto;

		let tasks = this.getAllTasks();

		if (status) {
			tasks = tasks.filter((task) => task.status === status);
		}

		if (search) {
			tasks = tasks.filter(
				(task) =>
					task.title.includes(search) || task.description.includes(search),
			);
		}

		return tasks;
	}

	createTask(taskDto: TaskDto): Task {
		const task: Task = {
			id: uuid(),
			...taskDto,
			status: TaskStatus.OPEN,
		};

		this.tasks.push(task);
		return task;
	}

	getTaskById(id: string): Task {
		const task = this.tasks.find((task) => task.id === id);
		if (!task) {
			throw new NotFoundException('Task Does Not Exist');
		}
		return task;
	}

	updateTaskById(id: string, status: string): Task {
		const task = this.getTaskById(id);
		task.status = TaskStatus[status];
		return task;
	}

	deleteTaskById(id: string): void {
		const found = this.getTaskById(id);
		this.tasks = this.tasks.filter((task) => task.id !== found.id);
	}
}
