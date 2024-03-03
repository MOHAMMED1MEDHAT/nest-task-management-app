import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwtPayload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userRepository: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { userName } = payload;
		const user = await this.userRepository.getUserByUserName(userName);
		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}

		return user;
	}
}
