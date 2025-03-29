import { Suspense } from 'react';
import InquiryDetail from './InquiryDetail';

export default function InquiryDetailPage() {
    return (
        <Suspense fallback={null}>
            <InquiryDetail />
        </Suspense>
    );
}