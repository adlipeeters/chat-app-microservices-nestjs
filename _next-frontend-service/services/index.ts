import axios from "axios";

export const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest._retry === undefined) {
            originalRequest._retry = false;
        }

        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);
