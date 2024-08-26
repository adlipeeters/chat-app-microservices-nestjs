// import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
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
}