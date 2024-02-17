import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwtPayload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IUserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private userRepository: IUserRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { userName } = payload;
		const user = await this.userRepository.findOne({ where: { userName } });

		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}

		return user;
	}
}
