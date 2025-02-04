import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Book {
    user_id: string;
    book_isbn: string;
    book_title: string;
    book_cover: string;
    book_author: string;
    status: string;
}

interface ReadingBook {
    book_isbn: string;
    book_cover: string;
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
    readingBook: ReadingBook | null;
    completedBook: ReadingBook | null;
    readingCount: number;
    completedCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: ReadingStatusState = {
    books: [],
    data: { status: '', review_id: '' },
    readingBook: null,
    completedBook: null,
    readingCount: 0,
    completedCount: 0,
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

export const updateBookStatus = createAsyncThunk(
    'readingStatus/updateBookStatus',
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

export const deleteBook = createAsyncThunk(
    'readingStatus/deleteBook',
    async ({ user_id, book_isbn, book_status, review_id }: { user_id: string; book_isbn: string; book_status: string; review_id: string }) => {
        const response = await fetch('/api/db/reading/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, book_isbn, book_status, review_id })
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

export const fetchReadingBook = createAsyncThunk(
    'readingStatus/fetchReadingBook',
    async ({ user_id }: { user_id: string }) => {
        try {
            const response = await fetch('/api/db/reading/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
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
            .addCase(updateBookStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateBookStatus.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(updateBookStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '상태 변경 실패'
            });
        builder
            .addCase(deleteBook.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteBook.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteBook.rejected, (state, action) => {
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
            })
            .addCase(fetchReadingBook.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReadingBook.fulfilled, (state, action) => {
                if (!action.payload?.result) return;
            
                const result = action.payload.result[0]; 
                if (!result) return;

                const { readingBook = [], completedBook = [], readingCount = [], completedCount = [] } = result;
                state.readingBook = readingBook.length > 0 ? readingBook[0] : null;
                state.completedBook = completedBook.length > 0 ? completedBook[0] : null;
                state.readingCount = readingCount.length > 0 ? readingCount[0].count : 0;
                state.completedCount = completedCount.length > 0 ? completedCount[0].count : 0;
                state.loading = false;
            })
            .addCase(fetchReadingBook.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '독서상태별 도서 조회 실패'
            });
    }
})

export default readingSlice.reducer