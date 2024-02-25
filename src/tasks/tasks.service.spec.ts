import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './../auth/user.entity';
import { TaskStatus } from './enums';

const mockUser: User = {
	userName: 'test user',
	password: 'Hash test',
	id: 4,
	tasks: [],
	isPasswordValid: jest.fn(),
	hasId: jest.fn(),
	save: jest.fn(),
	remove: jest.fn(),
	softRemove: jest.fn(),
	recover: jest.fn(),
	reload: jest.fn(),
};

const mockTaskRepository = {
	getAllTasks: jest.fn(),
	getTaskById: jest.fn(),
	createTask: jest.fn(),
	deleteTask: jest.fn(),
};

describe('TaskService', () => {
	let taskService: TasksService;
	let taskRepository: Repository<Task>;

	beforeAll(async () => {
		await User.save(mockUser);
	});

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: getRepositoryToken(Task),
					useValue: mockTaskRepository,
				},
			],
		}).compile();

		taskService = module.get<TasksService>(TasksService);
		taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
	});

	describe('createTask', () => {
		it('create a task', () => {
			const taskDto = {
				title: 'Test task',
				description: 'Test desc',
				status: TaskStatus.OPEN,
			};

			taskService.createTask(taskDto, mockUser);
			expect(taskRepository.save).toHaveBeenCalledTimes(1);
		});
	});

	describe('getTasks', () => {
		it('should get all tasks from the repository', () => {
			const filter: GetTasksFilterDto = {
				page: 0,
				limit: 10,
				sortBy: 'description',
				search: 'my',
				fields: 'description',
				sortOrder: 'DESC',
			};

			taskService.getAllTasks(filter, mockUser);
			expect(taskRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
		});
	});

	describe('getTaskById', () => {
		it('get a task by id', () => {
			const taskId = 1;
			taskService.getTaskById(taskId, mockUser);
			expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
		});
	});
});
