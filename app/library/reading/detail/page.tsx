import { Suspense } from 'react';
import ReadingDetail from './ReadingDetail';

export default function ReadingDetailPage() {
    return (
        <Suspense fallback={null}>
            <ReadingDetail />
        </Suspense>
    );
}