import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(user: User): Promise<Todo[]> {
        const todos = await this.todoRepository.find({
            where: { user },
        });
        return todos;
    }

    async create(user: User, title: string): Promise<Todo> {
        const todo = new Todo();
        todo.title = title;
        todo.completed = false;
        todo.user = user;
        return this.todoRepository.save(todo);
    }

    async update(id: number, completed: boolean, user: User): Promise<Todo> {
        const todo = await this.todoRepository.findOne({where: {id, userId: user.id}});
        if (!todo) {
            throw new NotFoundException();
        }
        if (todo.userId !== user.id) {
            throw new ForbiddenException();
        }
        todo.completed = completed;
        return this.todoRepository.save(todo);
    }

    async delete(id: number, user: User): Promise<void> {
        const result = await this.todoRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }
}

