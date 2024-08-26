export type User = {
    id: number;
    email: string;
    name: string;
    username: string;
    jwt: string;
}

export type UserSelectOption = {
    user_id: number;
    username: string;
}

export type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}