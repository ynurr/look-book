import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Book {
    title: string;
    author: string;
    publisher: string;
    cover: string;
    description: string;
    pubDate: string;
    categoryName: string;
    cleanAuthor: string;
    isbn13: string;
}

interface DetailState {
    book: Book | null;
    loading: boolean;
    error: string | null;
}

const initialState: DetailState = {
    book: null,
    loading: false,
    error: null
}

export const fetchBookDetails = createAsyncThunk(
    'detail/fetchBookDetails',
    async (id: string) => {
        const response = await fetch(`/api/detail?id=${id}`);
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        const data = await response.json();
        const copy = {...data.item[0]};
        copy.description = data.item[0].description
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>');
        copy.cleanAuthor = copy.author.replace(/\s*\(지은이\).*/, '');
        const [year, month, day] = copy.pubDate.split('-');
        copy.pubDate = `${year}년 ${month}월 ${day}일`;
        return copy;
    }
)

const detailSlice = createSlice({
    name: 'detail',
    initialState,
    reducers: {
        clearBook(state) {
            state.book = null; // book 상태 초기화
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.book = action.payload;
                console.log('book 상태 업데이트:', action.payload);
            })
            .addCase(fetchBookDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '알 수 없는 오류 발생';
            });
    }
})

export const { clearBook } = detailSlice.actions;

export default detailSlice.reducer;