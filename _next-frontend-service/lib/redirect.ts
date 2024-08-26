// utils/redirect.ts
import Router from 'next/router';

export const redirectToLogin = () => {
    Router.push('/login');
};
