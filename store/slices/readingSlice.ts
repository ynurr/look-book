import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Book {
    user_id: string;
    book_isbn: string[];
    book_title: string[];
    book_cover: string[];
    book_author: string[];
    status: string;
}

interface ReadingStatusState {
    books: Array<{
        isbn: string;
        title: string;
        author: string;
        cover: string;
        status: string;
        review_id?: string;
        rating: number;
    }>;
    data: {
        status: string;
        review_id: string;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: ReadingStatusState = {
    books: [],
    data: { status: '', review_id: '' },
    loading: false,
    error: null
}

export const fetchReadingStatus = createAsyncThunk(
    'readingStatus/fetchReadingStatus',
    async (user_id: string) => {
        try{
            const response = await fetch('/api/db/reading/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sub: user_id })
            });

            if (!response.ok) {
                throw new Error('독서현황 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const fetchUpdateStatus = createAsyncThunk(
    'readingStatus/fetchUpdateStatus',
    async (book: Book) => {
        const response = await fetch('/api/db/reading/modify', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            throw new Error('상태 변경 실패');
        }

        const data = await response.json();
        return data;
    }
)

export const fetchRemoveBook = createAsyncThunk(
    'readingStatus/fetchRemoveBook',
    async ({ user_id, book_isbn }: { user_id: string; book_isbn: string[] }) => {
        const response = await fetch('/api/db/reading/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, book_isbn })
        })

        if (!response.ok) {
            throw new Error('독서현황 삭제 실패');
        }
    
        const data = await response.json();
        return data;
    }
)

export const fetchUserReadingState = createAsyncThunk(
    'readingStatus/fetchUserReadingState',
    async ({ user_id, book_isbn }: { user_id: string; book_isbn: string }) => {
        try{
            const response = await fetch('/api/db/reading/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, book_isbn })
            });

            if (!response.ok) {
                throw new Error('독서상태 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

const readingSlice = createSlice({
    name: 'readingStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReadingStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReadingStatus.fulfilled, (state, action) => {
                state.books = action.payload
                state.loading = false
            })
            .addCase(fetchReadingStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '독서현황 조회 실패'
            });
        builder
            .addCase(fetchUpdateStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUpdateStatus.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchUpdateStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '상태 변경 실패'
            });
        builder
            .addCase(fetchRemoveBook.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRemoveBook.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchRemoveBook.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '독서현황 삭제 실패'
            });
        builder
            .addCase(fetchUserReadingState.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserReadingState.fulfilled, (state, action) => {
                if (!state.data) {
                    state.data = { status: '', review_id: '' };
                }
                state.data.status = action.payload.status;
                state.data.review_id = action.payload.review_id
                state.loading = false
            })
            .addCase(fetchUserReadingState.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '독서상태 조회 실패'
            });
    }
})

export default readingSlice.reducer