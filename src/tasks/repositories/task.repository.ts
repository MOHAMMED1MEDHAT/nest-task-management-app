import { Task } from '../task.entity';
import { Repository } from 'typeorm';

export interface ITaskRepository extends Repository<Task> {
	this: Repository<Task>;
	getTaskById(id: number): Promise<Task>;
}

export const customTaskRepository: Pick<ITaskRepository, any> = {
	getTaskById(this: Repository<Task>, id: number): Promise<Task> {
		return this.findOne({ where: { id } });
	},
};
