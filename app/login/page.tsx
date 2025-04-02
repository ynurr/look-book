import { Suspense } from 'react';
import Login from './Login';

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <Login />
        </Suspense>
    );
}