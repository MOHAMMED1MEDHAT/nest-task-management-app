import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import * as argon from 'argon2';
import { DataSource, Repository } from 'typeorm';
import { AuthDto } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
	private logger = new Logger('UserRepository');

	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
		this.dataSource = dataSource;
	}

	async signUp(authDto: AuthDto): Promise<User> {
		const { userName, password } = authDto;

		const hash = await this.hashPassword(password);

		const user = new User();
		user.userName = userName;
		user.password = hash;

		try {
			return await user.save();
		} catch (err) {
			this.logger.error(err.message);
			if (err.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}

	async validateUser(authDto: AuthDto): Promise<User> {
		const { userName, password } = authDto;

		const user = await this.findOne({ where: { userName } });

		if (!user || !(await user.isPasswordValid(password))) {
			return null;
		}

		return user;
	}

	async createUser(userName: string): Promise<User> {
		const user = new User();
		user.userName = userName;

		return await user.save();
	}

	async getUserById(id: number): Promise<User> {
		return await this.findOne({ where: { id } });
	}

	async deleteUser(id: number): Promise<void> {
		await this.delete({ id });
	}

	async getUserByUserName(userName: string): Promise<User> {
		return await this.findOne({ where: { userName } });
	}

	private async hashPassword(password: string): Promise<string> {
		return await argon.hash(password);
	}
}
