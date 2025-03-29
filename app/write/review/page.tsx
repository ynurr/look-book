import { Suspense } from 'react';
import WriteReview from './WriteReview';

export default function WriteReviewPage() {
    return (
        <Suspense fallback={null}>
            <WriteReview />
        </Suspense>
    );
}