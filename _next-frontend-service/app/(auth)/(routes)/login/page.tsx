"use client"

import React from 'react'
import { LoginForm } from './components/LoginForm'
import useUserStore from '@/store/user_store';
import { useRouter } from 'next/navigation';

const page = () => {
    const { user, setUser, clearUser } = useUserStore();
    const router = useRouter();
    console.log(user)
    if (user && user.id) {
        router.push('/chat');
        return null;
    }

    return (
        <div className='shadow-lg px-8 py-12 rounded-lg'>
            <LoginForm />
        </div>
    )
}

export default page