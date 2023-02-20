import {HttpStatus, INestApplication} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateTodoDto } from '../src/todo/dto/create-todo.dto';
import { UpdateTodoDto } from '../src/todo/dto/update-todo.dto';
import { Todo } from '../src/todo/todo.entity';

describe('TodoController (e2e)', () => {
    let app: INestApplication;
    let createdTodo: Todo;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a new user
        const newUser = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: 'e2etest@example.com',
                password: 'testpassword',
            });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/todos (GET)', () => {
        it('should return a list of todos', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer()).get('/todos').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });

    describe('/todos (POST)', () => {
        const createTodoDto: CreateTodoDto = { title: 'Test Todo' };

        it('should create a new todo', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .post('/todos')
                .set('Authorization', `Bearer ${token}`)
                .send(createTodoDto);
            expect(response.status).toBe(201);
            expect(response.body.todo.id).toBeDefined();
            expect(response.body.todo.title).toBe(createTodoDto.title);
            expect(response.body.todo.completed).toBe(false);
            createdTodo = response.body.todo;
        });

        it('should not create a new todo with invalid data', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .post('/todos')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: '' });
            expect(response.status).toBe(400);
        });
    });

    describe('/todos/:id (PUT)', () => {
        const updateTodoDto: UpdateTodoDto = { completed: true };

        it('should update an existing todo', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .put(`/todos/${createdTodo.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateTodoDto);
            expect(response.status).toBe(200);
            expect(response.body.todo.id).toBe(createdTodo.id);
            expect(response.body.todo.title).toBe(createdTodo.title);
            expect(response.body.todo.completed).toBe(updateTodoDto.completed);
            createdTodo = response.body.todo;
        });

        it('should not update a non-existing todo', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .put(`/todos/9999`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateTodoDto);
            expect(response.status).toBe(404);
        });

        it('should not update a todo with invalid data', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });
            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .put(`/todos/${createdTodo.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ completed: 'invalid value' });
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete a todo', async () => {
            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });

            const token = loginResponse.body.access_token;

            // Create a new todo for the user
            const newTodoResponse = await request(app.getHttpServer())
                .post('/todos')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'test todo',
                });

            // Delete the new todo
            const deleteResponse = await request(app.getHttpServer())
                .delete(`/todos/${newTodoResponse.body.todo.id}`)
                .set('Authorization', `Bearer ${token}`);

            // Check that the todo was deleted
            expect(deleteResponse.status).toEqual(200);
            expect(deleteResponse.body.message).toEqual('Todo has been deleted');
        });

        it('should return 404 if the todo is not found', async () => {
            const id = 123; // an ID that does not exist in the database

            // Log in as the new user to get a JWT token
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'e2etest@example.com',
                    password: 'testpassword',
                });

            const token = loginResponse.body.access_token;

            const response = await request(app.getHttpServer())
                .delete(`/todos/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.NOT_FOUND);

            expect(response.body.message).toEqual('Not Found');
        });
    });
});