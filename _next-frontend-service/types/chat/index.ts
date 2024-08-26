export type DBMessage = {
    id: number;
    chat_room_id: number;
    sender_id: number;
    receiver_id?: number;
    content: string;
    created_at: string;
    // updated_at: string;
}

export type Message = {
    content: string;
    sender_id: number;
}

export type RoomMember = {
    char_room_id: number;
    id: number;
    joined_at: string;
    name?: string;
    username?: string;
}