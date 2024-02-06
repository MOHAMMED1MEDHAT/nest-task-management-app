import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './enums';
import { TaskDto } from './dto/task.dto';
import { GetTasksFilterDto } from './dto';
import { ITaskRepository } from './repositories/task.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly taskRepository: ITaskRepository,
	) {}
	// getAllTasks(): Task[] {
	// 	return this.tasks;
	// }
	// getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
	// 	const { status, search } = filterDto;
	// 	let tasks = this.getAllTasks();
	// 	if (status) {
	// 		tasks = tasks.filter((task) => task.status === status);
	// 	}
	// 	if (search) {
	// 		tasks = tasks.filter(
	// 			(task) =>
	// 				task.title.includes(search) || task.description.includes(search),
	// 		);
	// 	}
	// 	return tasks;
	// }
	// createTask(taskDto: TaskDto): Task {
	// 	const task: Task = {
	// 		id: uuid(),
	// 		...taskDto,
	// 		status: TaskStatus.OPEN,
	// 	};
	// 	this.tasks.push(task);
	// 	return task;
	// }

	async getTaskById(id: number): Promise<Task> {
		const found = await this.taskRepository.getTaskById(id);

		if (!found) {
			throw new NotFoundException(`Task with ID: ${id} not found`);
		}

		return found;
	}
	// updateTaskById(id: string, taskDto): Task {
	// 	const task = this.getTaskById(id);
	// 	taskDto.title ? (task.title = taskDto.title) : task.title;
	// 	taskDto.description
	// 		? (task.description = taskDto.description)
	// 		: task.description;
	// 	taskDto.status ? (task.status = taskDto.status) : task.status;
	// 	return task;
	// }
	// updateTaskStatus(id: string, status: TaskStatus): Task {
	// 	const task = this.getTaskById(id);
	// 	task.status = status;
	// 	return task;
	// }
	// deleteTaskById(id: string): void {
	// 	const found = this.getTaskById(id);
	// 	this.tasks = this.tasks.filter((task) => task.id !== found.id);
	// }
}
