import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
    user_id: string;
    book_isbn: string[];
}

interface RemoveWishlistState {
    loading: boolean;
    error: string | null;
}

const initialState: RemoveWishlistState = {
    loading: false,
    error: null
}

export const fetchRemoveWishlist = createAsyncThunk(
    'removeWishlist/fetchRemoveWishlist',
    async (book: Book) => {
        const response = await fetch('/api/db/wishlist/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        })

        if (!response.ok) {
            throw new Error('위시리스트 삭제 실패')
        }
    
        const data = await response.json()
        return data
    }
)

const removeWishlistSlice = createSlice({
    name: 'removeWishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRemoveWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRemoveWishlist.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(fetchRemoveWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '위시리스트 삭제 실패'
            })
    },
})

export default removeWishlistSlice.reducer