import { ScrollArea } from '@/components/ui/scroll-area'
import { Message } from '@/types/chat'
import { User } from '@/types/user'
import React, { useEffect, useRef } from 'react'
import TypingInfo from './TypingInfo'
import Spinner from '@/components/Spinner'

const Messages = ({ messages, user, typingUsers, isLoading }: { messages: Message[], user: User, typingUsers: string[], isLoading: boolean }) => {
    // Create a ref to track the dummy div
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Use useEffect to scroll to the bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <ScrollArea className="w-full rounded-md border bg-white h-[70vh] md:max-h-[calc(100vh-27.5vh)] relative">
            {isLoading ? <Spinner /> : null}
            <div className="p-4 flex flex-col gap-4">
                {messages?.map((item: Message, _key: number) => (
                    <div key={_key}>
                        {
                            item.sender_id === user.id ?
                                <div className={`text-sm flex justify-end`}>
                                    <div className="bg-white p-3 rounded-md shadow-md">
                                        {item.content}
                                    </div>
                                </div>
                                : <div className={`text-sm flex justify-start`}>
                                    <div className="bg-slate-100 p-3 rounded-md shadow-md">
                                        {item.content}
                                    </div>
                                </div>
                        }
                    </div>
                ))}
                {/* Dummy div to scroll into view */}
                <div ref={messagesEndRef} />
            </div>
            {/* <div className='absolute bottom-[5px] left-[5px] w-full backdrop-blur-sm'>
                <TypingInfo typingUsers={typingUsers} />
            </div> */}
        </ScrollArea>
    )
}

export default Messages;
