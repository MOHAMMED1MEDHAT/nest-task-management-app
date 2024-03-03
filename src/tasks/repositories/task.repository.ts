// import { User } from './../../auth/user.entity';
// import { TaskDto, GetTasksFilterDto } from '../dto';
// import { TaskStatus } from '../enums';
import { Task } from '../task.entity';
// import { Repository, DeleteResult, DataSource } from 'typeorm';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { GetTasksFilterDto, TaskDto } from '../dto';
import { TaskStatus } from '../enums';

@Injectable()
export class TaskRepository extends Repository<Task> {
	private logger = new Logger('TaskRepository');
	constructor(private dataSource: DataSource) {
		super(Task, dataSource.createEntityManager());
		this.dataSource = dataSource;
	}

	async getAllTasks(
		user: User,
		filterDto?: GetTasksFilterDto,
	): Promise<Task[]> {
		const { search, page, limit, fields, sortBy, sortOrder } = filterDto;
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
			this.logger.error(
				`Failed to get tasks for user "${user.userName}". Filters: ${JSON.stringify(filterDto)}`,
				err.stack,
			);
			throw new InternalServerErrorException();
		}
	}

	async getTaskById(id: number, user: User): Promise<Task> {
		const found = await this.findOne({ where: { id, userId: user.id } });

		if (!found) {
			throw new InternalServerErrorException(`Task with ID: ${id} not found`);
		}

		return found;
	}

	async createTask(taskDto: TaskDto, user: User): Promise<Task> {
		const { title, description } = taskDto;
		const task = new Task();
		task.title = title;
		task.description = description;
		task.status = TaskStatus.OPEN;
		task.user = user;
		try {
			await task.save();
		} catch (err) {
			this.logger.error(
				`Failed to create a task for user "${user.userName}". Data: ${JSON.stringify(
					taskDto,
				)}`,
				err.stack,
			);
			throw new InternalServerErrorException();
		}
		delete task.user;

		return task;
	}

	async deleteTask(id: number, user: User): Promise<void> {
		const result = await this.delete({ id, userId: user.id });

		if (result.affected === 0) {
			throw new InternalServerErrorException(`Task with ID: ${id} not found`);
		}
	}
}
