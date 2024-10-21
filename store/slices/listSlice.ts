import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Books {
    title: string;
    author: string;
    cover: string;
    isbn13: string;
}

export const fetchBookList = createAsyncThunk(
    'list/fetchBookList',
    async( { type, max }: { type: string, max: string } ) => {
        const response = await fetch(`/api/list?type=${type}&max=${max}`);
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        const data = await response.json();
        return data.item || [];
    }
)

const listSlice = createSlice({
    name: 'list',
    initialState: {
        bestList: [] as Books[],
        latestList: [] as Books[],
        ratingList: [] as Books[],
        loading: false,
        error: null as string | null
    },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBookList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookList.fulfilled, (state, action) => {
                if (action.meta.arg.type === 'Bestseller') {
                    state.bestList = action.payload;
                } else if (action.meta.arg.type === 'ItemNewSpecial') {
                    state.latestList = action.payload;
                } else if (action.meta.arg.type === 'BlogBest') {
                    state.ratingList = action.payload;
                }
                state.loading = false;
            })
            .addCase(fetchBookList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '알 수 없는 오류 발생';
            });
    },
})

export default listSlice.reducer