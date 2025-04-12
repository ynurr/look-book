import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface likeState {
    isLike: boolean;
    likeReviewIds: string[];
    likeAll: Array<{
        _id: string;
        book_isbn: string; 
        book_title: string;
        book_author: string; 
        content: string;
        rating: number; 
    }>;
    loading: boolean;
    error: string | null;
}

const initialState: likeState = {
    isLike: false,
    likeReviewIds: [],
    likeAll: [],
    loading: false,
    error: null,
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

export const fetchUserLikeList = createAsyncThunk(
    'like/fetchUserLikeList',
    async ({ user_id, book_isbn }: { user_id: string, book_isbn: string }) => {
        try{
            const response = await fetch('/api/db/review/like/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, book_isbn })
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
    async ({ user_id, review_id, book_isbn, isLike }: { user_id: string, review_id: string, book_isbn: string, isLike: boolean }) => {
        try{
            const response = await fetch('/api/db/review/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, review_id, book_isbn, isLike })
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

export const fetchLikeAll = createAsyncThunk(
    'like/fetchLikeAll',
    async ({ user_id }: { user_id: string }) => {
        try{
            const response = await fetch('/api/db/like/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });

            if (!response.ok) {
                throw new Error('공감 목록 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const deleteLike = createAsyncThunk(
    'like/deleteLike',
    async ({ user_id, review_id }: { user_id: string, review_id: string }) => {
        try{
            const response = await fetch('/api/db/like/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, review_id })
            });

            if (!response.ok) {
                throw new Error('공감 해제 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Delete error:', error);
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
                state.error = action.error.message || '좋아요 조회 실패'
            })
            .addCase(fetchUserLikeList.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserLikeList.fulfilled, (state, action) => {
                state.likeReviewIds = action.payload
                state.loading = false
            })
            .addCase(fetchUserLikeList.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '좋아요 조회 실패'
            })
            .addCase(updateLike.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateLike.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(updateLike.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '좋아요 업데이트 실패'
            })
            .addCase(fetchLikeAll.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchLikeAll.fulfilled, (state, action) => {
                state.likeAll = action.payload.result
                state.loading = false
            })
            .addCase(fetchLikeAll.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '공감 목록 조회 실패'
            })
            .addCase(deleteLike.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteLike.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteLike.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '공감 해제 실패'
            });
    },
});

export default likeSlice.reducer;