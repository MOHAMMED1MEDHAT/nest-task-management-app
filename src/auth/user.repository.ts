import {
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { User } from './user.entity';

export interface IUserRepository extends Repository<User> {
	this: Repository<User>;
	// getAllUsers(filterDto?: GetUsersFilterDto): Promise<User[]>;
	signUp(authDto: AuthDto): Promise<User>;
	validateUser(authDto: AuthDto): Promise<User>;
	// getUserById(id: number): Promise<User>;
	// createUser(UserDto: UserDto): Promise<User>;
	// deleteUser(id: number): Promise<DeleteResult>;
}

export const customUserRepository: Pick<IUserRepository, any> = {
	async signUp(this: Repository<User>, authDto: AuthDto): Promise<User> {
		const { userName, password } = authDto;

		const hash = await hashPassword(password);

		const user = new User();
		user.userName = userName;
		user.password = hash;

		try {
			return await user.save();
		} catch (err) {
			if (err.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}
	},

	async validateUser(authDto: AuthDto): Promise<User> {
		const { userName, password } = authDto;

		const user = await this.findOne({ where: { userName } });

		if (!user || !(await user.isPasswordValid(password))) {
			return null;
		}

		return user;
	},

	async getUserById(this: Repository<User>, id: number): Promise<User> {
		return await this.findOne({ where: { id } });
	},

	// async createUser(this: Repository<User>, UserDto: UserDto): Promise<User> {
	// 	const { title, description } = UserDto;
	// 	const User = new User();
	// 	User.title = title;
	// 	User.description = description;
	// 	User.status = UserStatus.OPEN;
	// 	await User.save();

	// 	return User;
	// },

	async deleteUser(this: Repository<User>, id: number): Promise<DeleteResult> {
		return await this.delete(id);
	},
};

async function hashPassword(password: string): Promise<string> {
	return await argon.hash(password);
}
