import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface statState {
    goal: number;
    bookCount: number;
    reviewCount: number;
    lastRead: string;
    loading: boolean;
    error: string | null;
}

const initialState: statState = {
    goal: 0,
    bookCount: 0,
    reviewCount: 0, 
    lastRead: '',
    loading: false,
    error: null,
};

export const fetchUserStat = createAsyncThunk(
    'stat/fetchUserStat',
    async ({ user_id }: { user_id: string }) => {
        try{
            const response = await fetch('/api/db/user/stat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id })
            });

            if (!response.ok) {
                throw new Error('사용자 스탯 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

const statSlice = createSlice({
    name: 'stat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserStat.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserStat.fulfilled, (state, action) => {
                state.goal = action.payload.goal;
                state.bookCount = action.payload.bookCount;
                state.reviewCount = action.payload.reviewCount;
                state.lastRead = action.payload.lastRead;
                state.loading = false
            })
            .addCase(fetchUserStat.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '사용자 스탯 조회 실패'
            })
    },
});

export default statSlice.reducer;