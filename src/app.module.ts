import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		TasksModule,
		ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
	],
})
export class AppModule {}
