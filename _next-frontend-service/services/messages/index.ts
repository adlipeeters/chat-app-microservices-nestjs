import { API_URLS } from '@/lib/constants';
import axios from 'axios';
import { axiosInstance } from '..';

export const getMessages = async (roomId: number) => {
    const response = await axiosInstance.get(API_URLS.CHAT_MICROSERVICE + `/message/room/${roomId}`);
    return response.data;
};
