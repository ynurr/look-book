import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InquiryState {
    inquiries: Array<{
        inquiry_id: string;
        title: string;
        content: string;
        status: string;
        created_at: string;
    }>;
    inquiry: {title: string, content: string, response: string, created_at: string, responded_at: string}
    loading: boolean;
    error: string | null;
}

const initialState: InquiryState = {
    inquiries: [],
    inquiry: {title: '', content: '', response: '', created_at: '', responded_at: ''},
    loading: false,
    error: null
}

export const fetchWriteInquiry = createAsyncThunk(
    'inquiry/fetchWriteInquiry',
    async ({user_id, title, content}: {user_id: string, title: string, content: string}) => {
        try {
            const response = await fetch('/api/db/inquiry/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, title, content })
            });
    
            if (!response.ok) {
                throw new Error('문의 작성 실패')
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchInquiryAll = createAsyncThunk(
    'inquiry/fetchInquiryAll',
    async ({user_id}: {user_id: string}) => {
        try {
            const response = await fetch('/api/db/inquiry/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });

            if (!response.ok) {
                throw new Error('문의내역 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchInquiryDetail = createAsyncThunk(
    'inquiry/fetchInquiryDetail',
    async (inquiry_id: string) => {
        try {
            const response = await fetch(`/api/db/inquiry/detail?id=${inquiry_id}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('문의내역 상세 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)


const inquirySlice = createSlice({
    name: 'inquiry',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWriteInquiry.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWriteInquiry.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchWriteInquiry.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '문의 작성 실패'
            })
            .addCase(fetchInquiryAll.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchInquiryAll.fulfilled, (state, action) => {
                state.inquiries = action.payload
                state.loading = false
            })
            .addCase(fetchInquiryAll.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '문의내역 조회 실패'
            })
            .addCase(fetchInquiryDetail.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchInquiryDetail.fulfilled, (state, action) => {
                state.inquiry = action.payload.data
                state.loading = false
            })
            .addCase(fetchInquiryDetail.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '문의내역 상세 조회 실패'
            })
    }
})

export default inquirySlice.reducer