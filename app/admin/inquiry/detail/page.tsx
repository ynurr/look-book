import { Suspense } from 'react';
import AdminInquiryDetail from './AdminInquiryDetail';

export default function AdminInquiryDetailPage() {
    return (
        <Suspense fallback={null}>
            <AdminInquiryDetail />
        </Suspense>
    );
}