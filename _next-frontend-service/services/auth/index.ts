import { API_URLS } from '@/lib/constants';
import { Login } from '@/types/auth';
import { axiosInstance } from '..';

export const login = async (data: Login) => {
    const response = await axiosInstance.post(API_URLS.AUTH_MICROSERVICE + '/auth/login', data);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post(API_URLS.AUTH_MICROSERVICE + '/auth/logout');
    return response.data;
}
