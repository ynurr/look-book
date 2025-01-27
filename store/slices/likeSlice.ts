import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface likeState {
    isLike: boolean;
    count: number;
    loading: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: likeState = {
    isLike: false,
    count: 0,
    loading: false,
    error: null,
    initialized: false
};

export const fetchUserLike = createAsyncThunk(
    'like/fetchUserLike',
    async ({ user_id, review_id }: { user_id: string, review_id: string }) => {
        try{
            const response = await fetch('/api/db/review/like/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, review_id })
            });

            if (!response.ok) {
                throw new Error('좋아요 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const updateLike = createAsyncThunk(
    'like/updateLike',
    async ({ user_id, review_id, isLike }: { user_id: string, review_id: string; isLike: boolean }) => {
        try{
            const response = await fetch('/api/db/review/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, review_id, isLike })
            });

            if (!response.ok) {
                throw new Error('좋아요 업데이트 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Update error:', error);
        }
    }
)

const likeSlice = createSlice({
    name: 'like',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLike.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserLike.fulfilled, (state, action) => {
                state.isLike = action.payload
                state.loading = false
            })
            .addCase(fetchUserLike.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '좋아요 업데이트 실패'
            })
            .addCase(updateLike.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateLike.fulfilled, (state, action) => {
                state.count = action.payload
                state.loading = false
                state.initialized = true
            })
            .addCase(updateLike.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '좋아요 업데이트 실패'
            });
    },
});

export default likeSlice.reducer;