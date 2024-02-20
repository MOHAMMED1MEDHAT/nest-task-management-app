import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto';
import { Repository } from 'typeorm';

const mockUser = { name: 'TEST USER' };

const mockTaskRepository = {
	getTasks: jest.fn(),
};

describe('TaskService', () => {
	let taskService: TasksService;
	let taskRepository: Repository<Task>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TasksService,
				{ provide: getRepositoryToken(Task), useValue: mockTaskRepository },
			],
		}).compile();

		taskService = await module.get<TasksService>(TasksService);
		taskRepository = await module.get<Repository<Task>>(
			getRepositoryToken(Task),
		);
	});

	describe('getTasks', () => {
		it('get all tasks from the repository', () => {
			// expect().not.toHaveBeenCalledTimes(1);

			const filter: GetTasksFilterDto = {
				page: 0,
				limit: 10,
				sortBy: 'description',
				search: 'my',
				fields: 'description',
				sortOrder: 'DESC',
			};

			// taskService.getTasks(filter, mockUser);
			expect(taskRepository).toHaveBeenCalledTimes(1);
		});
	});
});
