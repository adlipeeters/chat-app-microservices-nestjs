import { IsNotEmpty, MinLength, MaxLength, IsNumber, IsOptional } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty()
    content: string;

    @IsNumber()
    sender_id: number;

    @IsNumber()
    @IsOptional()
    chat_room_id?: number;
}
