import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError } from "typeorm";

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        signUp: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('login', () => {
        it('should return a token on successful login', async () => {
            const mockToken = { access_token: 'mockToken' };
            const mockLoginDto: LoginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            jest.spyOn(service, 'login').mockResolvedValueOnce(mockToken);

            const result = await controller.login(mockLoginDto);

            expect(service.login).toHaveBeenCalledWith(mockLoginDto);
            expect(result).toEqual(mockToken);
        });
    });

    describe('signUp', () => {
        it('should create a new user on successful sign up and return token', async () => {
            const mockToken = { access_token: 'mockToken' };
            const mockCreateUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            jest.spyOn(service, 'signUp').mockResolvedValueOnce(mockToken);

            const result = await controller.signUp(mockCreateUserDto);

            expect(service.signUp).toHaveBeenCalledWith(mockCreateUserDto);
            expect(result).toEqual(mockToken);
        });

        it('should throw a conflict exception if the email is already taken', async () => {
            const mockCreateUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
            };
            jest.spyOn(service, 'signUp').mockRejectedValueOnce(
                new QueryFailedError('query', [], 'Email already exists')
            );

            await expect(controller.signUp(mockCreateUserDto)).rejects.toThrowError('Email already exists');
        });
    });
});
