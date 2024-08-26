"use client";

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';

const Users = () => {
    const { data, error, isLoading, } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    });

    if (isLoading) return <div>Loading...</div>;

    if (data) {
        console.log(data);
    }
    if (error) {
        console.log(error);
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Data:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Users;
