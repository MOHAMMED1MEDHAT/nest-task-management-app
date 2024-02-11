import { AuthDto } from './dto';
import { User } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';

export interface IUserRepository extends Repository<User> {
	this: Repository<User>;
	// getAllUsers(filterDto?: GetUsersFilterDto): Promise<User[]>;
	signUp(authDto: AuthDto): Promise<User>;
	// getUserById(id: number): Promise<User>;
	// createUser(UserDto: UserDto): Promise<User>;
	// deleteUser(id: number): Promise<DeleteResult>;
}

export const customUserRepository: Pick<IUserRepository, any> = {
	async signUp(this: Repository<User>, authDto: AuthDto): Promise<User> {
		const { userName, password } = authDto;

		const user = new User();
		user.userName = userName;
		user.password = password;

		return await user.save();
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
