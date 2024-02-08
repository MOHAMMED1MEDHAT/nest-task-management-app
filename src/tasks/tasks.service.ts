import { Injectable, NotFoundException } from '@nestjs/common';
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

	async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
		return await this.taskRepository.getAllTasks(filterDto);
	}

	async createTask(taskDto: TaskDto): Promise<Task> {
		return this.taskRepository.createTask(taskDto);
	}

	async getTaskById(id: number): Promise<Task> {
		const found = await this.taskRepository.getTaskById(id);

		if (!found) {
			throw new NotFoundException(`Task with ID: ${id} not found`);
		}

		return found;
	}

	async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
		const task = await this.getTaskById(id);
		task.status = status;
		await this.taskRepository.save(task);
		return task;
	}

	async deleteTaskById(id: number): Promise<void> {
		const result = await this.taskRepository.deleteTask(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Task with ID: ${id} not found`);
		}
	}
}
