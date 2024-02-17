import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataSource } from 'typeorm';
import {
	TypeOrmModule,
	getDataSourceToken,
	getRepositoryToken,
} from '@nestjs/typeorm';
import { User } from './user.entity';
import { customUserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.startegy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: process.env.JWT_EXPIRES_IN,
			},
		}),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: getRepositoryToken(User),
			inject: [getDataSourceToken()],
			useFactory(dataSource: DataSource): any {
				return dataSource.getRepository(User).extend(customUserRepository);
			},
		},
		AuthService,
		JwtStrategy,
	],
	exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
