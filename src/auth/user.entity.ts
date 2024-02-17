import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

import * as argon from 'argon2';
import { Task } from 'src/tasks/task.entity';

@Entity('users')
@Unique(['userName'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column()
	password: string;

	@OneToMany(() => Task, (task) => task.user, { eager: true })
	tasks: Task[];

	async isPasswordValid(password: string): Promise<boolean> {
		return await argon.verify(this.password, password);
	}
}
