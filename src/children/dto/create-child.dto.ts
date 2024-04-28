import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateChildDto {
    @IsNotEmpty()
    name: string;

    @IsNumber()
    age: number;

}
