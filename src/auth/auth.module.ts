import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

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
	providers: [UserRepository, AuthService, JwtStrategy],
	// providers: [
	// 	{
	// 		provide: getRepositoryToken(User),
	// 		inject: [getDataSourceToken()],
	// 		useFactory(dataSource: DataSource): any {
	// 			return dataSource.getRepository(User).extend(customUserRepository);
	// 		},
	// 	},
	// 	AuthService,
	// 	JwtStrategy,
	// ],
	exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
