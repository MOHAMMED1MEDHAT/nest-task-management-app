import { User } from './../../auth/user.entity';
import { TaskDto, GetTasksFilterDto } from '../dto';
import { TaskStatus } from '../enums';
import { Task } from '../task.entity';
import { Repository, DeleteResult } from 'typeorm';
import {
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';

export interface ITaskRepository extends Repository<Task> {
	this: Repository<Task>;
	getAllTasks(user: User, filterDto?: GetTasksFilterDto): Promise<Task[]>;
	getTaskById(id: number, user: User): Promise<Task>;
	createTask(taskDto: TaskDto, user: User): Promise<Task>;
	deleteTask(id: number, user: User): Promise<DeleteResult>;
}

const logger = new Logger('TaskRepository');

export const customTaskRepository: Pick<ITaskRepository, any> = {
	async getAllTasks(
		this: Repository<Task>,
		user: User,
		tasksFilterDto?: GetTasksFilterDto,
	): Promise<Task[]> {
		const { search, page, limit, fields, sortBy, sortOrder } = tasksFilterDto;
		const query = this.createQueryBuilder('task');

		query.where('task.userId = :userId', { userId: user.id });

		if (search) {
			query.where('task.title LIKE :search OR task.description LIKE :search', {
				search: `%${search}%`,
			});
		}

		if (fields) {
			const fieldsMap = [...fields.split(',')]
				.filter(
					(field) =>
						field == 'status' || field == 'title' || field == 'description',
				)
				.map((field) => `task.${field}`);
			query.select(fieldsMap);
		}

		if (sortBy) {
			query.orderBy(sortBy, sortOrder);
		}

		if (page && limit) {
			query.skip((page - 1) * limit).take(limit);
		}

		try {
			return await query.getMany();
		} catch (err) {
			logger.error(
				`Failed to get tasks for user "${user.userName}". Filters: ${JSON.stringify(tasksFilterDto)}`,
				err.stack,
			);
			throw new InternalServerErrorException();
		}
	},

	async getTaskById(
		this: Repository<Task>,
		id: number,
		user: User,
	): Promise<Task> {
		const found = await this.findOne({ where: { id, userId: user.id } });

		if (!found) {
			throw new NotFoundException(`Task with ID: ${id} not found`);
		}

		return found;
	},

	async createTask(
		this: Repository<Task>,
		taskDto: TaskDto,
		user: User,
	): Promise<Task> {
		const { title, description } = taskDto;
		const task = new Task();
		task.title = title;
		task.description = description;
		task.status = TaskStatus.OPEN;
		task.user = user;
		try {
			await task.save();
		} catch (err) {
			logger.error(
				`Failed to create a task for user "${user.userName}". Data: ${JSON.stringify(
					taskDto,
				)}`,
				err.stack,
			);
			throw new InternalServerErrorException();
		}
		delete task.user;

		return task;
	},

	async deleteTask(
		this: Repository<Task>,
		id: number,
		user: User,
	): Promise<void> {
		const result = await this.delete({ id, userId: user.id });

		if (result.affected === 0) {
			throw new NotFoundException(`Task with ID: ${id} not found`);
		}
	},
};
