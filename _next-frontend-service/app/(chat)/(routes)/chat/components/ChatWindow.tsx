"use client";

import {
    CornerDownLeft,
    MessageSquareDot,
    Mic,
    Paperclip,
    UserRoundPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { useEffect, useState, useCallback } from "react";
import socketService from "@/services/socket/socketService";
import useUserStore from "@/store/user_store";
import { usePathname } from "next/navigation";

import Messages from "./Messages";

import { useQuery } from '@tanstack/react-query';
import { getMessages } from "@/services/messages";
import { DBMessage, Message, RoomMember } from "@/types/chat";
import { getRoom } from "@/services/rooms";
import useRoomStore from "@/store/chat/room_store";
import useDebounce from "@/hooks/useDebounce";
import TypingInfo from "./TypingInfo";

const ChatWindow = () => {
    const pathname = usePathname();
    const chatRoomId = pathname.split("/").pop();

    const { user } = useUserStore();
    const { handleAddUserToRoom } = useRoomStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const [room, setRoom] = useState<string>(String(chatRoomId));
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const debouncedIsTyping = useDebounce(message, 300);

    const { data: dbMessages, error, isLoading } = useQuery({
        queryKey: ['messages', chatRoomId],
        queryFn: () => getMessages(Number(chatRoomId)),
    });

    const { data: roomData, isSuccess: roomDataSuccess } = useQuery({
        queryKey: ['room', chatRoomId],
        queryFn: () => getRoom(Number(chatRoomId)),
    });

    useEffect(() => {
        if (dbMessages) {
            const messages = dbMessages.map((message: DBMessage) => ({
                content: message.content,
                sender_id: message.sender_id
            }));
            setMessages(messages);
        }
    }, [dbMessages]);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        handleIsTyping(true);
    }

    const handleFocus = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleIsTyping(true);
    };

    const onBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleIsTyping(false);
    };

    const sendMessage = () => {
        if (message === '') return;
        socketService.emit('message', { room, message });
        setMessage('');
        handleIsTyping(false);
    }

    const handleIsTyping = (state: boolean) => {
        socketService.emit('is_typing', { room, typing: state, username: user?.username });
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const messageListener = useCallback((message: { content: string, sender_id: number }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }, []);

    const typingListener = useCallback((data: { typingUsers: string[] }) => {
        setTypingUsers(data.typingUsers);
    }, []);

    const joinRoom = (roomName: string) => {
        socketService.emit('joinRoom', roomName);
        setRoom(roomName);
    }

    const leaveRoom = (roomName: string) => {
        socketService.emit('leaveRoom', roomName);
    }

    useEffect(() => {
        const token = user?.jwt ?? '';
        socketService.connect(token);
        socketService.on('message', messageListener);
        socketService.on('is_typing', typingListener);

        // Join the default room
        joinRoom(room);

        return () => {
            socketService.off('message', messageListener);
            socketService.off('is_typing', typingListener);
            leaveRoom(room); // Leave the current room
            socketService.disconnect();
        }
    }, [messageListener, typingListener, room, user?.jwt]);

    return (
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
            <div className="flex justify-between gap-2">
                <p className="bg-black text-white px-2 rounded-t-md py-1 flex items-center gap-2">
                    <MessageSquareDot />
                    {roomData ? <span>{roomData.name}</span> : null}
                </p>
                <p className="flex items-center font-semibold">
                    {roomData ? roomData.members.map((member: RoomMember) => member.username).join(', ') : null}
                </p>
            </div>
            {
                roomDataSuccess && roomData.owner_id === user?.id ? (
                    <button
                        onClick={() => handleAddUserToRoom({ open: true, roomId: roomData.id })}
                        className="absolute right-6 top-[55px] bg-black text-white text-xs z-10 px-3 py-1 rounded-md flex items-center gap-3">
                        <span>Add User</span>
                        <UserRoundPlus className="w-5 h-5" />
                    </button>
                ) : ''
            }
            <div className="flex-1 flex h-full">
                {user ? (<Messages messages={messages} user={user} typingUsers={typingUsers} isLoading={isLoading} />) : ''}
            </div>
            <form className="mt-2 relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Label htmlFor="message" className="sr-only">
                    Message
                </Label>
                <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    value={message}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onBlur={onBlur}
                    onFocus={handleFocus}
                />
                <div className="flex items-center p-3 pt-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="size-4" />
                                    <span className="sr-only">Attach file</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Attach File</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Mic className="size-4" />
                                    <span className="sr-only">Use Microphone</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Use Microphone</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button
                        onClick={sendMessage}
                        type="button" size="sm" className="ml-auto gap-1.5"
                    >
                        Send Message
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
            </form>
            <div className='w-full backdrop-blur-sm'>
                <TypingInfo typingUsers={typingUsers} />
            </div>
        </div>
    )
}

export default ChatWindow;
