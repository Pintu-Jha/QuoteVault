import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from './env';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: {
                    user_id: string;
                    name: string | null;
                    avatar_url: string | null;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    name?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string;
                };
                Update: {
                    user_id?: string;
                    name?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string;
                };
            };
            quotes: {
                Row: {
                    id: string;
                    text: string;
                    author: string;
                    category: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    text: string;
                    author: string;
                    category: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    text?: string;
                    author?: string;
                    category?: string;
                    created_at?: string;
                };
            };
            favorites: {
                Row: {
                    id: string;
                    user_id: string;
                    quote_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    quote_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    quote_id?: string;
                    created_at?: string;
                };
            };
            collections: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    created_at?: string;
                };
            };
            collection_quotes: {
                Row: {
                    id: string;
                    collection_id: string;
                    quote_id: string;
                };
                Insert: {
                    id?: string;
                    collection_id: string;
                    quote_id: string;
                };
                Update: {
                    id?: string;
                    collection_id?: string;
                    quote_id?: string;
                };
            };
            user_settings: {
                Row: {
                    user_id: string;
                    theme: 'light' | 'dark';
                    accent_color: string;
                    font_size: number;
                    notifications_enabled: boolean;
                    notification_time: string | null;
                };
                Insert: {
                    user_id: string;
                    theme?: 'light' | 'dark';
                    accent_color?: string;
                    font_size?: number;
                    notifications_enabled?: boolean;
                    notification_time?: string | null;
                };
                Update: {
                    user_id?: string;
                    theme?: 'light' | 'dark';
                    accent_color?: string;
                    font_size?: number;
                    notifications_enabled?: boolean;
                    notification_time?: string | null;
                };
            };
        };
    };
}
