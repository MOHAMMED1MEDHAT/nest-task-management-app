import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import { JwtPayload } from './jwtPayload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
	constructor(
		private userRepository: UserRepository,
		private jwtService: JwtService,
	) {}

	async signUp(authDto: AuthDto): Promise<User> {
		return this.userRepository.signUp(authDto);
	}

	async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
		const user = await this.userRepository.validateUser(authDto);

		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}

		const payload: JwtPayload = { userName: user.userName };
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN,
			secret: process.env.JWT_SECRET,
		});

		return { accessToken };
	}
}
