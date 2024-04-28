import { IsString, MinLength, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @MinLength(4, {message: 'Короткий пароль'})
    password: string;

    @IsNumber()
    age: number;
}
