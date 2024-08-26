import { IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsNumber()
    @IsOptional()
    owner_id?: number;
}
