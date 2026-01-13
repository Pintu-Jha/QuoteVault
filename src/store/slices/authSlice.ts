import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: User | null; session: any | null }>) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.isAuthenticated = !!action.payload.user;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        clearAuth: (state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
    },
});

export const { setUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
