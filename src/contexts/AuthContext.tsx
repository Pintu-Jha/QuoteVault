import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, clearAuth } from '../store/slices/authSlice';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoadingState] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUserState(currentUser);
            dispatch(setUser({ user: currentUser, session }));
            setIsLoadingState(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUserState(currentUser);
            dispatch(setUser({ user: currentUser, session }));
        } catch (error) {
            console.error('Failed to check session:', error);
        } finally {
            setIsLoadingState(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setUserState(data.user);
            dispatch(setUser({ user: data.user, session: data.session }));
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            });

            if (error) throw error;

            setUserState(data.user);
            dispatch(setUser({ user: data.user, session: data.session }));
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Failed to sign up');
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUserState(null);
            dispatch(clearAuth());
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    };

    const resetPassword = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'quotevault://reset-password',
            });

            if (error) throw error;
        } catch (error: any) {
            console.error('Password reset error:', error);
            throw new Error(error.message || 'Failed to send reset email');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
                resetPassword,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
