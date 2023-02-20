import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const hashedPassword = 'hashedPassword';
            const user = new User();
            user.email = email;
            user.password = hashedPassword;
            jest.spyOn(repository, 'save').mockResolvedValueOnce(user);
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);

            const result = await service.create(email, password);

            expect(repository.save).toHaveBeenCalledWith(user);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
            expect(result).toEqual(user);
        });

        it('should throw BadRequestException if password is not provided', async () => {
            const email = 'test@example.com';
            const password = '';
            await expect(service.create(email, password)).rejects.toThrow(
                BadRequestException,
            );
            expect(repository.save).not.toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });
    });

    describe('findByEmail', () => {
        it('should find a user by email', async () => {
            const email = 'test@example.com';
            const user = new User();
            user.email = email;
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

            const result = await service.findByEmail(email);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toEqual(user);
        });

        it('should return undefined if user not found', async () => {
            const email = 'test@example.com';
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

            const result = await service.findByEmail(email);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(result).toBeUndefined();
        });
    });
});
