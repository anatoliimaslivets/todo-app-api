import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
    let controller: TodoController;
    let service: TodoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodoController],
            providers: [
                {
                    provide: TodoService,
                    useValue: {
                        findAll: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TodoController>(TodoController);
        service = module.get<TodoService>(TodoService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('findAll', () => {
        it('should return a list of todos', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const mockTodos = [
                { id: 1, title: 'test todo 1', completed: false, userId: 1, user: mockUser },
                { id: 2, title: 'test todo 2', completed: true, userId: 1, user: mockUser },
            ];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockTodos);

            const result = await controller.findAll(mockUser);

            expect(service.findAll).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual({ todos: mockTodos });
        });
    });

    describe('create', () => {
        it('should create a new todo', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const mockTodo = { id: 1, title: 'test todo 1', completed: false, userId: 1, user: mockUser };
            jest.spyOn(service, 'create').mockResolvedValueOnce(mockTodo);

            const result = await controller.create(mockUser, { title: 'test todo' });

            expect(service.create).toHaveBeenCalledWith(mockUser, 'test todo');
            expect(result).toEqual({ todo: mockTodo });
        });
    });

    describe('update', () => {
        it('should update a todo', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const mockTodo = { id: 1, title: 'test todo 1', completed: true, userId: 1, user: mockUser };
            jest.spyOn(service, 'update').mockResolvedValueOnce(mockTodo);

            const result = await controller.update('1', { completed: true }, mockUser);

            expect(service.update).toHaveBeenCalledWith(1, true, mockUser);
            expect(result).toEqual({ todo: mockTodo });
        });
    });

    describe('delete', () => {
        it('should delete a todo', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password: '', todos: [] };
            const id = '1';
            jest.spyOn(service, 'delete').mockResolvedValueOnce(undefined);

            const result = await controller.delete(id, mockUser);

            expect(service.delete).toHaveBeenCalledWith(+id, mockUser);
            expect(result).toEqual({ message: 'Todo has been deleted' });
        });
    });
});
