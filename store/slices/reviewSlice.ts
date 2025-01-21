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
    review: {review_id: string, rating: number, content: string};
    bookReviews: Array<{
        review_id: string;
        content: string;
        rating: number;
        like_count: number;
        date: string;
        nickname: string;
    }>;
    totalCount: number;
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
    review: {review_id: '', rating: 0, content: ''},
    bookReviews: [],
    totalCount: 0,
    loading: false,
    error: null
}

export const fetchReviewAll = createAsyncThunk(
    'review/fetchReviewAll',
    async (user_id: string) => {
        try {
            const response = await fetch('/api/db/review/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user_id})
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

export const fetchReviewById = createAsyncThunk(
    'review/fetchReviewById',
    async (review_id: string) => {
        try {
            const response = await fetch(`/api/db/review/detail?id=${encodeURIComponent(review_id)}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('리뷰 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchEditReview = createAsyncThunk(
    'review/fetchEditReview',
    async ({review_id, content, rating}: {review_id: string, content:string, rating: number}) => {
        try {
            const response = await fetch('/api/db/review/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({review_id, content, rating})
            });
    
            if (!response.ok) {
                throw new Error('리뷰 수정 실패')
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchReviewByBook = createAsyncThunk(
    'review/fetchReviewByBook',
    async (isbn: string) => {
        try {
            const response = await fetch(`/api/db/review/book?isbn=${isbn}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('도서 리뷰 조회 실패')
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
                state.error = action.error.message || '나의리뷰 조회 실패'
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
            .addCase(fetchReviewById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReviewById.fulfilled, (state, action) => {
                state.review = action.payload
                state.loading = false
            })
            .addCase(fetchReviewById.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '리뷰 조회 실패'
            })
            .addCase(fetchEditReview.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEditReview.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchEditReview.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '리뷰 수정 실패'
            })
            .addCase(fetchReviewByBook.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReviewByBook.fulfilled, (state, action) => {
                state.bookReviews = action.payload.data
                state.totalCount = action.payload.totalCount
                state.loading = false
            })
            .addCase(fetchReviewByBook.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '도서 리뷰 조회 실패'
            })
    }
})

export default reviewSlice.reducer