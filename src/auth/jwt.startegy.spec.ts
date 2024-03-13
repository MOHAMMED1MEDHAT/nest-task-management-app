import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.startegy';
import { UserRepository } from './user.repository';
// import { User } from "./user.entity";

const mockUserRepository = {
	findOne: jest.fn(),
	signUp: jest.fn(),
	validateUser: jest.fn(),
	getUserById: jest.fn(),
	deleteUser: jest.fn(),
	getUserByUserName: jest.fn(),
};

describe('JwtStrategy', () => {
	let jwtStrategy: JwtStrategy;
	let userRepository: UserRepository;
	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				JwtStrategy,
				{
					provide: UserRepository,
					useValue: mockUserRepository,
				},
			],
		}).compile();

		jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
		userRepository = module.get<UserRepository>(UserRepository);
	});

	describe('validate', () => {
		it('should validates and returns the user based on JWT payload', async () => {
			expect(userRepository.validateUser).not.toHaveBeenCalled();
			const mockUser = { userName: 'TestUser' };
			expect(jwtStrategy.validate(mockUser)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(userRepository.getUserByUserName).toHaveBeenCalledTimes(1);
		});
	});
});
