import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigsModule } from './configs/configs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
	imports: [
		// ConfigsModule.forRoot({ envFilePath: '.env', isGlobal: true }),
		ConfigsModule,
		TasksModule,
		TypeOrmModule.forRoot(typeOrmConfig),
	],
})
export class AppModule {}
