import { API_URLS } from '@/lib/constants';
import io, { Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    public connect(token: string): void {
        this.socket = io(API_URLS.CHAT_MICROSERVICE_GATEWAY, {
            auth: {
                token
            }
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    public off(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    public emit(event: string, data: any): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

const socketService = new SocketService();
export default socketService;
