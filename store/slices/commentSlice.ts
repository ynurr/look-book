import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CommentState {
    comments:  Array<{
        comment_id: string;
        review_id: string;
        user_id: string;
        content: string;
        parent_id: string;
        date: string;
        nickname: string;
    }>;
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null
}

export const addComment = createAsyncThunk(
    'comment/addComment',
    async ({ review_id, book_isbn, user_id, content, parent_id}: { review_id: string, book_isbn: string, user_id: string, content: string, parent_id: string }) => {
        try {
            const response = await fetch('/api/db/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ review_id, book_isbn, user_id, content, parent_id })
            });

            if (!response.ok) {
                throw new Error('댓글 작성 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Insert error:', error);
        }
    }
)

export const fetchComments = createAsyncThunk(
    'comment/fetchComments',
    async (isbn: string) => {
        try {
            const response = await fetch(`/api/db/comment?isbn=${isbn}`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error('댓글 조회 실패')
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const deleteComment = createAsyncThunk(
    'comment/deleteComment',
    async ({comment_id, user_id}: {comment_id: string, user_id: string}) => {
        try {
            const response = await fetch('/api/db/comment/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment_id, user_id })
            })

            if (!response.ok) {
                throw new Error('댓글 삭제 실패')
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Delete error:', error);
        }
    }
)

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addComment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addComment.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '댓글 작성 실패'
            })
            .addCase(fetchComments.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload.data
                state.loading = false
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '댓글 조회 실패'
            })
            .addCase(deleteComment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteComment.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '댓글 삭제 실패'
            })
    }
})

export default commentSlice.reducer