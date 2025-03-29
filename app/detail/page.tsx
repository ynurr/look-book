import { Suspense } from 'react';
import Detail from './Detail';

export default function DetailPage() {
    return (
        <Suspense fallback={null}>
            <Detail />
        </Suspense>
    );
}