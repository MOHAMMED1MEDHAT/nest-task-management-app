import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

@Entity('users')
@Unique(['userName'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column()
	password: string;
}
