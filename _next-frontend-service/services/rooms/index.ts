import { API_URLS } from '@/lib/constants';
import axios from 'axios';
import { axiosInstance } from '..';

export const getRooms = async () => {
    const response = await axiosInstance.get(API_URLS.CHAT_MICROSERVICE + '/room');
    return response.data;
};

export const createRoom = async (data: { name: string }) => {
    const response = await axiosInstance.post(API_URLS.CHAT_MICROSERVICE + '/room', data);
    return response.data;
};

export const getRoom = async (roomId: number) => {
    const response = await axiosInstance.get(API_URLS.CHAT_MICROSERVICE + `/room/${roomId}`);
    return response.data;
};

export const isRoomMember = async (room_id: number) => {
    const response = await axiosInstance.get(API_URLS.CHAT_MICROSERVICE + `/room/is-member/${room_id}`);
    return response.data;
};

export const addUserToRoom = async (data: { room_id: number, user_id: number }) => {
    const response = await axiosInstance.post(API_URLS.CHAT_MICROSERVICE + `/room/add-user`, data);
    return response.data;
};

export const getTypingUsers = async (room_id: number) => {
    const response = await axiosInstance.get(API_URLS.CHAT_MICROSERVICE + `/room/typing-users/${room_id}`);
    return response.data;
}
