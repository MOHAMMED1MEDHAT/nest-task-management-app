import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
	const logger: Logger = new Logger('bootstrap');

	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	await app.listen(process.env.PORT);

	logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
