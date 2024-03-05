import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { GetTasksFilterDto } from './dto';
import { TaskStatus } from './enums';
import { TaskRepository } from './repositories/task.repository';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockUser = {
	userName: 'test user',
	password: 'test Hash',
};

const mockTaskRepository = {
	getAllTasks: jest.fn(),
	getTaskById: jest.fn(),
	createTask: jest.fn(),
	deleteTask: jest.fn(),
	save: jest.fn(),
};

describe('TaskService', () => {
	let taskService: TasksService;
	let taskRepository: TaskRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TaskRepository,
					useValue: mockTaskRepository,
				},
			],
		}).compile();

		taskService = module.get<TasksService>(TasksService);
		taskRepository = <TaskRepository>(
			module.get<Repository<Task>>(TaskRepository)
		);
	});

	describe('createTask', () => {
		it('create a task', () => {
			const taskDto = {
				title: 'Test task',
				description: 'Test desc',
				status: TaskStatus.OPEN,
			};

			expect(taskRepository.createTask).toHaveBeenCalledTimes(0);
			taskService.createTask(taskDto, <User>mockUser);
			expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
		});
	});

	describe('getTasks', () => {
		it('should get all tasks from the repository', async () => {
			expect(taskRepository.getAllTasks).not.toHaveBeenCalledTimes(1);

			const filter: GetTasksFilterDto = {
				page: 0,
				limit: 10,
				sortBy: 'description',
				search: 'my',
				fields: 'description',
				sortOrder: 'DESC',
			};

			expect(taskRepository.getAllTasks).toHaveBeenCalledTimes(0);
			await taskService.getAllTasks(filter, <User>mockUser);
			expect(taskRepository.getAllTasks).toHaveBeenCalledTimes(1);
		});
	});

	describe('getTaskById', () => {
		it('should get a task by id', async () => {
			const getTaskByIdSpyOn = jest
				.spyOn(taskRepository, 'getTaskById')
				.mockResolvedValue({
					title: 'test1',
					description: 'this task is for testing',
					status: TaskStatus.OPEN,
				} as Task);

			expect(taskRepository.getTaskById).toHaveBeenCalledTimes(0);
			await taskService.getTaskById(1, <User>mockUser);
			expect(taskRepository.getTaskById).toHaveBeenCalledTimes(1);
			expect(getTaskByIdSpyOn).toHaveBeenCalledWith(1, <User>mockUser);
		});
		it('should throw NotFoundException', () => {
			const getTaskByIdSpyOn = jest
				.spyOn(taskRepository, 'getTaskById')
				.mockResolvedValue(null);
			expect(taskService.getTaskById(1, <User>mockUser)).rejects.toThrow(
				NotFoundException,
			);
			expect(getTaskByIdSpyOn).toHaveBeenCalledWith(1, <User>mockUser);
		});
	});

	describe('updateTaskStatus', () => {
		it('should update task status', async () => {
			const getTaskByIdSpyOn = jest
				.spyOn(taskRepository, 'getTaskById')
				.mockResolvedValue({
					title: 'test1',
					description: 'this task is for testing',
					status: TaskStatus.OPEN,
				} as Task);
			expect(taskRepository.save).toHaveBeenCalledTimes(0);
			await taskService.updateTaskStatus(
				2,
				<User>mockUser,
				TaskStatus.IN_PROGRESS,
			);
			expect(taskRepository.save).toHaveBeenCalledTimes(1);
			expect(getTaskByIdSpyOn).toHaveBeenCalledWith(2, <User>mockUser);
		});
	});

	describe('deleteTask', () => {
		it('should delete a task by id', async () => {
			expect(taskRepository.deleteTask).toHaveBeenCalledTimes(0);
			await taskService.deleteTaskById(1, <User>mockUser);
			expect(taskRepository.deleteTask).toHaveBeenCalledTimes(1);
		});
	});
});
