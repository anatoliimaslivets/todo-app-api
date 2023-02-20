import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.decorator';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    @ApiOperation({ summary: 'Get ToDo list for authorized user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async findAll(@User() user): Promise<any> {
        const todos = await this.todoService.findAll(user);
        return { todos };
    }

    @Post()
    @ApiOperation({ summary: 'Create new record in the list' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async create(@User() user, @Body(ValidationPipe) createTodoDto: CreateTodoDto): Promise<any> {
        const todo = await this.todoService.create(user, createTodoDto.title);
        return { todo };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Updating the record status' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body(ValidationPipe) updateTodoDto: UpdateTodoDto, @User() user): Promise<any> {
        const todo = await this.todoService.update(+id, updateTodoDto.completed, user);
        return { todo };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove an entry from the list' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string, @User() user): Promise<any> {
        await this.todoService.delete(+id, user);
        return { message: 'Todo has been deleted' };
    }
}
