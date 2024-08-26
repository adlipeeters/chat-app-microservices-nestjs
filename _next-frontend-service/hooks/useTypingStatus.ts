import { useState, useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import socketService from '@/services/socket/socketService';

const useTypingStatus = (message: string, room: string) => {
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const debouncedMessage = useDebounce(message, 300);

    useEffect(() => {
        if (message && !isTyping) {
            setIsTyping(true);
            socketService.emit('is_typing', { room, typing: true });
        } else if (!message && isTyping) {
            setIsTyping(false);
            socketService.emit('is_typing', { room, typing: false });
        }
    }, [debouncedMessage, isTyping, message, room]);

    return { isTyping, setIsTyping };
};

export default useTypingStatus;
