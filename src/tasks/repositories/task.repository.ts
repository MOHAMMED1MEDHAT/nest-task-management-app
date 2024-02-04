import { Task } from '../task.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

const dataSource=new DataSource({
  
})

export type UserRepositoryType = Repository<Task> & {
	findById(id: number): Promise<Task | null>;
};

// this UserRepository only exists in value space. Without my previous type declaration I cannot return it from my helper function.
const UserRepository: UserRepositoryType = .getRepository(
	Task,
).extend({
	findById(id: number): Promise<Task | null> {
		return;
	},

	isEmailAlreadyInUser(email: string): Promise<boolean> {
		// Implementation not relevant
	},
});

// Helper function, so clients are shielded of typeoRM access.
export function getUserRepository(manager: EntityManager): UserRepositoryType {
	return manager.withRepository(UserRepository);
}
