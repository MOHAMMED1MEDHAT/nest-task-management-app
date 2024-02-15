import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

import * as argon from 'argon2';

@Entity('users')
@Unique(['userName'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column()
	password: string;

	async validatePassword(password: string): Promise<boolean> {
		return await argon.verify(this.password, password);
	}
}
