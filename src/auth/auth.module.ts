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

@Module({
	imports: [TypeOrmModule.forFeature([User])],
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
	],
})
export class AuthModule {}
