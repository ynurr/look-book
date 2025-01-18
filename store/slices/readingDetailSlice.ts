import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Reading {
    reading_id: string;
    isbn: string;
    title: string;
    author: string;
    cover: string;
    status: string;
}

interface Review {
    review_id: string;
    rating: number;
    content: string;
    like_count: number;
    created_at: string;
}

interface ReadingDetailState {
    reading: Reading | null;
    review: Review;
    loading: boolean;
    error: string | null;
}

const initialState: ReadingDetailState = {
    reading: null,
    review: {
        review_id: '',
        rating: 0,
        content: '',
        like_count: 0,
        created_at: '',
    },
    loading: false,
    error: null
}

export const fetchReadingDetail = createAsyncThunk(
    'readingDetail/fetchReadingDetail',
    async ({user_id, book_isbn}: {user_id: string, book_isbn: string}) => {
        try {
            const response = await fetch(`/api/db/reading/detail?id=${user_id}&isbn=${book_isbn}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('독서 상세 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

const readingDetailSlice = createSlice({
    name: 'readingDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReadingDetail.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReadingDetail.fulfilled, (state, action) => {
                const { reading, review } = action.payload || {};
                state.reading = reading;
                if (review) {
                    state.review = review;
                } else {
                    state.review = {
                        review_id: '',
                        rating: 0,
                        content: '',
                        like_count: 0,
                        created_at: '',
                    };
                }
                state.loading = false
            })
            .addCase(fetchReadingDetail.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '독서 상세 조회 실패'
            })
    }
})

export default readingDetailSlice.reducer