import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Books {
    title: string;
    author: string;
    publisher: string;
    cover: string;
    description: string;
    pubDate: string;
    categoryName: string;
    isbn13: string;
}

interface AuthorBooksState {
    books: Books[];
    loading: boolean;
    error: string | null;
}

const initialState: AuthorBooksState = {
    books: [],
    loading: false,
    error: null
}

export const fetchAuthorBooks = createAsyncThunk(
    'search/fetchAuthorBooks',
    async ({ keyword }: { keyword: string; }) => {
        const response = await fetch(`/api/external/search?keyword=${keyword}&type=Author&max=6`);
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        const data = await response.json();
        return data.item || [];
    }
)

const authorBooksSlice = createSlice({
    name: 'authorBooks',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAuthorBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuthorBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                console.log('list 상태 업데이트:', action.payload);
            })
            .addCase(fetchAuthorBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '알 수 없는 오류 발생';
            });
    },
})

export default authorBooksSlice.reducer;