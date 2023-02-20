import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/signup (POST)', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                email: 'newe2etest@example.com',
                password: 'password',
            };
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(createUserDto)
                .expect(201);
        });

        it('should return a 409 conflict error if email already exists', async () => {
            const createUserDto = {
                email: 'newe2etest@example.com',
                password: 'password',
            };
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(createUserDto)
                .expect(409);
        });
    });

    describe('/auth/login (POST)', () => {
        it('should return an authentication token', async () => {
            const loginDto = {
                email: 'newe2etest@example.com',
                password: 'password',
            };
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200);

            expect(response.body).toHaveProperty('access_token');
            authToken = response.body.access_token;
        });

        it('should return a 401 unauthorized error if credentials are invalid', async () => {
            const loginDto = {
                email: 'newe2etest@example.com',
                password: 'wrongpassword',
            };
            return request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(401);
        });
    });
});
