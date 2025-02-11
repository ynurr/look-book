import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface accountState {
    id: string;
    nickname: string;
    status: number;
    message: string;
    loading: boolean;
    error: string | null;
}

const initialState: accountState = {
    id: '',
    nickname: '',
    status: 0,
    message: '',
    loading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'account/fetchUserProfile',
    async ({ user_id, password }: { user_id: string, password: string }) => {
        try{
            const response = await fetch('/api/db/account/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, password })
            });

            if (!response.ok) {
                throw new Error('사용자 정보 조회 실패')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

export const checkNicknameDuplication = createAsyncThunk(
    'account/checkNicknameDuplication',
    async ({ nickname }: { nickname: string }) => {
        try{
            const response = await fetch(`/api/db/check/nickname?nickname=${encodeURIComponent(nickname)}`, {
                method: 'GET'
            });
            
            const data = await response.json();

            if (response.status === 200 || response.status === 208) {
                return { status: response.status, message: data.message }; 
            } else {
                throw new Error('닉네임 중복 체크 실패')
            }

        } catch (error) {
            console.log('Fetch error:', error);
        }
    }
)

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.id = action.payload.id
                state.nickname = action.payload.nickname
                state.loading = false
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '사용자 정보 조회 실패'
            })
            .addCase(checkNicknameDuplication.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(checkNicknameDuplication.fulfilled, (state, action) => {
                if (action.payload) {
                    state.status = action.payload.status;
                    state.message = action.payload.message;
                }
                state.loading = false
            })
            .addCase(checkNicknameDuplication.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || '닉네임 조회 실패'
            })
    },
});

export default accountSlice.reducer;