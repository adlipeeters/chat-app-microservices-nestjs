"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services/users';
import { useRouter, usePathname } from 'next/navigation';
import { CustomError } from '@/types/axios_error';
import useUserStore from '@/store/user_store';
import { Comment } from 'react-loader-spinner'
import Spinner from '@/components/SpinnerFullHeight';
import SpinnerFullHeight from '@/components/SpinnerFullHeight';

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { user, setUser, clearUser } = useUserStore();
    const router = useRouter();
    const pathname = usePathname()

    const { data, error, isLoading } = useQuery({
        queryKey: ['profile_info'],
        queryFn: getMe,
        retry: 0
    });

    console.log(data)

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data, setUser]);

    useEffect(() => {
        if (error) {
            const customError = error as CustomError;
            if (customError.response && (customError.response.status === 401 || customError.response.status === 403)) {
                clearUser();
                router.push('/login');
            }
        }
    }, [error, clearUser, router]);

    return (
        <>
            {isLoading ? <SpinnerFullHeight /> : null}
            {children}
        </>
    );
}

export default ProtectedRoutes;
