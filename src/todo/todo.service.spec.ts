import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import {ForbiddenException, NotFoundException} from "@nestjs/common";

describe('TodoService', () => {
    let todoService: TodoService;
    let todoRepository: Repository<Todo>;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                TodoService,
                {
                    provide: getRepositoryToken(Todo),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        todoService = moduleRef.get<TodoService>(TodoService);
        todoRepository = moduleRef.get<Repository<Todo>>(getRepositoryToken(Todo));
        userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('findAll', () => {
        it('should return an array of todos for a given user', async () => {
            const mockUser = new User();
            mockUser.id = 1;

            const mockTodo1 = new Todo();
            mockTodo1.id = 1;
            mockTodo1.title = 'Mock todo 1';
            mockTodo1.completed = false;
            mockTodo1.user = mockUser;

            const mockTodo2 = new Todo();
            mockTodo2.id = 2;
            mockTodo2.title = 'Mock todo 2';
            mockTodo2.completed = true;
            mockTodo2.user = mockUser;

            jest.spyOn(todoRepository, 'find').mockResolvedValueOnce([mockTodo1, mockTodo2]);

            const result = await todoService.findAll(mockUser);
            expect(result).toEqual([mockTodo1, mockTodo2]);
        });
    });

    describe('create', () => {
        it('should create a new todo for a given user', async () => {
            const mockUser = new User();
            mockUser.id = 1;

            const mockTodo = new Todo();
            mockTodo.id = 1;
            mockTodo.title = 'New todo';
            mockTodo.completed = false;
            mockTodo.user = mockUser;

            jest.spyOn(todoRepository, 'save').mockResolvedValueOnce(mockTodo);

            const result = await todoService.create(mockUser, 'New todo');
            expect(result).toEqual(mockTodo);
        });
    });

    describe('update', () => {
        it('should update a todo with a new completed value', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            const mockTodo = new Todo();
            mockTodo.id = 1;
            mockTodo.title = 'Mock todo';
            mockTodo.completed = false;
            mockTodo.user = mockUser;
            mockTodo.userId = mockUser.id;

            jest.spyOn(todoRepository, 'findOne').mockResolvedValueOnce(mockTodo);
            jest.spyOn(todoRepository, 'save').mockResolvedValueOnce({
                ...mockTodo,
                completed: true,
            });

            const result = await todoService.update(1, true, mockUser);
            expect(result).toEqual({ ...mockTodo, completed: true });
        });

        it('should throw a NotFoundException if the todo is not found', async () => {
            jest.spyOn(todoRepository, 'findOne').mockResolvedValueOnce(undefined);

            await expect(todoService.update(1, true, new User())).rejects.toThrowError(NotFoundException);
        });

        it('should throw a ForbiddenException if the todo does not belong to the user', async () => {
            const mockUser = new User();
            mockUser.id = 1;
            const mockTodo = new Todo();
            mockTodo.id = 1;
            mockTodo.title = 'Mock todo';
            mockTodo.completed = false;
            mockTodo.user = new User();
            mockTodo.user.id = 2;

            jest.spyOn(todoRepository, 'findOne').mockResolvedValueOnce(mockTodo);

            await expect(todoService.update(1, true, mockUser)).rejects.toThrowError(ForbiddenException);
        });
    });

    describe('delete', () => {
        it('should delete a todo by id and user', async () => {
            const id = 1;
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const todo = new Todo();
            todo.id = id;
            todo.title = 'Test todo';
            todo.completed = false;
            todo.user = mockUser;

            const deleteSpy = jest.spyOn(todoRepository, 'delete').mockResolvedValue({
                affected: 1,
                raw: [],
            });

            await expect(todoService.delete(id, mockUser)).resolves.toBeUndefined();

            expect(deleteSpy).toHaveBeenCalledWith({ id, user: mockUser });
        });

        it('should throw NotFoundException when given an invalid id and user', async () => {
            const todoId = 1;
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const deleteSpy = jest.spyOn(todoRepository, 'delete').mockResolvedValue({
                affected: 0,
                raw: [],
            });

            await expect(todoService.delete(todoId, mockUser)).rejects.toThrow(NotFoundException);
            expect(deleteSpy).toHaveBeenCalledWith({ id: todoId, user: mockUser });
        });
    });
});