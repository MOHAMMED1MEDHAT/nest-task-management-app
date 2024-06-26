import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/signup')
	signUp(@Body() authDto: AuthDto): Promise<User> {
		return this.authService.signUp(authDto);
	}

	@Post('/signin')
	signIn(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
		return this.authService.signIn(authDto);
	}
}
