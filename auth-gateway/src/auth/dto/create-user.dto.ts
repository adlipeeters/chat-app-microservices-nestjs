import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    username: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
}
