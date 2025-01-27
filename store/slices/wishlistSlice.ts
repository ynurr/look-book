import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch } from "../store"

interface Book {
    wish_id: string;
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
    async (sub: string) => {
        const response = await fetch('/api/db/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sub })
    })

    if (!response.ok) {
        throw new Error('위시리스트 조회 실패')
    }

    const data = await response.json()
    return data
        
})

export const addWishlist = createAsyncThunk(
    'addWishlist/addWishlist',
    async ({user_id, book_isbn, book_title, book_cover, book_author}: {user_id: string, book_isbn: string, book_title: string, book_cover: string, book_author: string}) => {
        const response = await fetch('/api/db/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, book_isbn, book_title, book_cover, book_author })
        })

        if (!response.ok) {
            throw new Error('위시리스트 추가 실패')
        }
    
        const data = await response.json()
        return data
    }
)

export const deleteWishlist = createAsyncThunk(
    'removeWishlist/deleteWishlist',
    async ({user_id, book_isbn}: {user_id: string, book_isbn: string[]}) => {
        const response = await fetch('/api/db/wishlist/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id, book_isbn })
        })

        if (!response.ok) {
            throw new Error('위시리스트 삭제 실패')
        }
    
        const data = await response.json()
        return data
    }
)

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
            .addCase(deleteWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteWishlist.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '위시리스트 삭제 실패'
            })            
    },
})

export default wishlistSlice.reducer