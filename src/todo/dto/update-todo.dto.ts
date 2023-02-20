import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from 'class-validator';

export class UpdateTodoDto {
    @ApiProperty()
    @IsBoolean()
    completed: boolean;
}
