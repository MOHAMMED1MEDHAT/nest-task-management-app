import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './enums';
import { User } from 'src/auth/user.entity';

@Entity('tasks')
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	status: TaskStatus;

	@ManyToOne(() => User, (user) => user.tasks, { eager: false })
	user: User;
}
