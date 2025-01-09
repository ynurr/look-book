import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch } from "../store"

interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    cover: string;
}

interface WishlistState {
    wishlist: Book[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    wishlist: [],
    loading: false,
    error: null
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist', 
    async (id: string) => {
        const response = await fetch('/api/db/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: id})
    })

    if (!response.ok) {
        throw new Error('위시리스트 조회 실패')
    }

    const data = await response.json()
    return data
        
})

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Book[]>) => {
                state.loading = false
                state.wishlist = action.payload
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '위시리스트 조회 실패'
            })
    },
})

export default wishlistSlice.reducer