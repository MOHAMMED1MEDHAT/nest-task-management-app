import { TaskDto, GetTasksFilterDto } from '../dto';
import { TaskStatus } from '../enums';
import { Task } from '../task.entity';
import { Repository, DeleteResult } from 'typeorm';

export interface ITaskRepository extends Repository<Task> {
	this: Repository<Task>;
	getAllTasks(filterDto?: GetTasksFilterDto): Promise<Task[]>;
	getTaskById(id: number): Promise<Task>;
	createTask(taskDto: TaskDto): Promise<Task>;
	deleteTask(id: number): Promise<DeleteResult>;
}

export const customTaskRepository: Pick<ITaskRepository, any> = {
	async getAllTasks(
		this: Repository<Task>,
		tasksFilterDto?: GetTasksFilterDto,
	): Promise<Task[]> {
		const { search, page, limit, fields, sortBy, sortOrder } = tasksFilterDto;
		const query = this.createQueryBuilder('task');

		if (search) {
			query.where('task.title LIKE :search OR task.description LIKE :search', {
				search: `%${search}%`,
			});
		}

		if (fields) {
			query.select(fields);
		}

		if (sortBy) {
			query.orderBy(sortBy, sortOrder);
		}

		if (page && limit) {
			query.skip((page - 1) * limit).take(limit);
		}

		return await query.getMany();
	},
	async getTaskById(this: Repository<Task>, id: number): Promise<Task> {
		return await this.findOne({ where: { id } });
	},
	async createTask(this: Repository<Task>, taskDto: TaskDto): Promise<Task> {
		const { title, description } = taskDto;
		const task = new Task();
		task.title = title;
		task.description = description;
		task.status = TaskStatus.OPEN;
		await task.save();

		return task;
	},

	async deleteTask(this: Repository<Task>, id: number): Promise<DeleteResult> {
		return await this.delete(id);
	},
};
