import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        nickname: string;
        sub: string;
    }

    interface Session {
        user: User;
    }
}