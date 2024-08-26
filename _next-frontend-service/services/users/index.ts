import { API_URLS } from '@/lib/constants';
import axios from 'axios';
import { axiosInstance } from '..';

export const getUsers = async () => {
    const response = await axiosInstance.get(API_URLS.USER_MICROSERVICE + '/user');
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get(API_URLS.USER_MICROSERVICE + '/user/me');
    return response.data;
};

export const searchUser = async (search: string) => {
    const response = await axiosInstance.get(API_URLS.USER_MICROSERVICE + `/user/search-user/${search}`);
    return response.data;
};
