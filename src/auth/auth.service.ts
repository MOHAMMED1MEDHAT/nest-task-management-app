import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: IUserRepository,
	) {}

	async signUp(authDto: AuthDto): Promise<User> {
		return this.userRepository.signUp(authDto);
	}

	async signIn(authDto: AuthDto): Promise<User> {
		const user = await this.userRepository.validateUser(authDto);

		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}

		return user;
	}
}
