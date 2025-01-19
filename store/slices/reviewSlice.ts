import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ReviewState {
    reviews: Array<{
        review_id: string;
        isbn: string;
        title: string;
        cover: string;
        rating: number;
        content: string;
        like_count: number;
        created_at: string;
    }>;
    loading: boolean;
    error: string | null;
}

interface Book {
    sub: string;
    isbn: string;
    title: string;
    cover: string;
    author: string;
    content: string;
    rating: number;
    status: string;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null
}

export const fetchReviewAll = createAsyncThunk(
    'review/fetchReviewAll',
    async (user_id: string) => {
        try {
            const response = await fetch(`/api/db/review/list?id=${encodeURIComponent(user_id)}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('나의리뷰 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchWriteReview = createAsyncThunk(
    'review/fetchWriteReview',
    async (book: Book) => {
        try {
            const response = await fetch('/api/db/review/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            });
    
            if (!response.ok) {
                throw new Error('리뷰 작성 실패')
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewAll.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReviewAll.fulfilled, (state, action) => {
                state.reviews = action.payload
                state.loading = false
            })
            .addCase(fetchReviewAll.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '리뷰 작성 실패'
            })
            .addCase(fetchWriteReview.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWriteReview.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchWriteReview.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '리뷰 작성 실패'
            })
    }
})

export default reviewSlice.reducer