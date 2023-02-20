import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Todo } from '../todo/todo.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Exclude()
    @OneToMany(() => Todo, todo => todo.user, { cascade: true })
    todos: Todo[];
}
