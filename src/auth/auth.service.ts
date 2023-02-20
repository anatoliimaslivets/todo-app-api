import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload: JwtPayload = { userId: user.id };
        const token = this.jwtService.sign(payload);

        return { access_token: token };
    }

    async signUp(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        // check if user with email already exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const user = await this.usersService.create(
            email,
            password,
        );
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

