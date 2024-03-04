import { Injectable } from '@nestjs/common';
import { User } from './../auth/user.entity';
import { GetTasksFilterDto } from './dto';
import { TaskDto } from './dto/task.dto';
import { TaskStatus } from './enums';
import { TaskRepository } from './repositories/task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
	constructor(private readonly taskRepository: TaskRepository) {}

	async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		return await this.taskRepository.getAllTasks(user, filterDto);
	}

	async createTask(taskDto: TaskDto, user: User): Promise<Task> {
		return this.taskRepository.createTask(taskDto, user);
	}

	async getTaskById(id: number, user: User): Promise<Task> {
		return await this.taskRepository.getTaskById(id, user);
	}

	async updateTaskStatus(
		id: number,
		user: User,
		status: TaskStatus,
	): Promise<Task> {
		const task = await this.getTaskById(id, user);
		task.status = status;
		await this.taskRepository.save(task);
		return task;
	}

	async deleteTaskById(id: number, user: User): Promise<void> {
		await this.taskRepository.deleteTask(id, user);
	}
}
