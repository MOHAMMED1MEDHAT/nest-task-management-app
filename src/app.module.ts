import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigsModule } from './configs/configs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigsModule,
		TasksModule,
		TypeOrmModule.forRoot(typeOrmConfig),
		AuthModule,
	],
})
export class AppModule {}
