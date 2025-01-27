import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
    user_id: string;
    book_isbn: string;
    book_title: string;
    book_cover: string;
    book_author: string;
}

interface AddWishlistState {
    loading: boolean;
    error: string | null;
}

const initialState: AddWishlistState = {
    loading: false,
    error: null
}

export const addWishlist = createAsyncThunk(
    'addWishlist/addWishlist',
    async (book: Book) => {
        const response = await fetch('/api/db/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (!response.ok) {
            throw new Error('위시리스트 추가 실패')
        }
    
        const data = await response.json()
        return data
    }
)

const addWishlistSlice = createSlice({
    name: 'addWishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addWishlist.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(addWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '위시리스트 추가 실패'
            })
    },
})

export default addWishlistSlice.reducer