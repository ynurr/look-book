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

interface SearchState {
    books: Books[];
    loading: boolean;
    error: string | null;
}

const initialState: SearchState = {
    books: [],
    loading: false,
    error: null
}

export const fetchSearchBooks = createAsyncThunk(
    'search/fetchSearchBooks',
    async ({ keyword }: { keyword: string; }) => {
        const response = await fetch(`/api/search?keyword=${keyword}&type=&max=100`);
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        const data = await response.json();
        return data.item || [];
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchSearchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                console.log('list 상태 업데이트:', action.payload);
            })
            .addCase(fetchSearchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '알 수 없는 오류 발생';
            });
    },
})

export default searchSlice.reducer;