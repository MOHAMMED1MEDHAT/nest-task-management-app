import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigsModule } from './configs/configs.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
	imports: [
		ConfigsModule,
		TasksModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
	],
})
export class AppModule {}
