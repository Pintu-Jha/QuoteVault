import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../../config/supabase';

export interface Quote {
    id: string;
    text: string;
    author: string;
    category: string;
    created_at: string;
}

export interface Favorite {
    id: string;
    user_id: string;
    quote_id: string;
    created_at: string;
    quote?: Quote;
}

export interface Collection {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export interface CollectionQuote {
    id: string;
    collection_id: string;
    quote_id: string;
    quote?: Quote;
}

export interface UserProfile {
    user_id: string;
    name: string | null;
    avatar_url: string | null;
    updated_at: string;
}

export interface UserSettings {
    user_id: string;
    theme: 'light' | 'dark';
    accent_color: string;
    font_size: number;
    notifications_enabled: boolean;
    notification_time: string | null;
}

export const supabaseApi = createApi({
    reducerPath: 'supabaseApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Quotes', 'Favorites', 'Collections', 'UserProfile', 'UserSettings'],
    endpoints: (builder) => ({
        getQuotes: builder.query<Quote[], { category?: string; limit?: number; offset?: number }>({
            async queryFn({ category, limit = 50, offset = 0 }) {
                try {
                    let query = supabase
                        .from('quotes')
                        .select('*')
                        .range(offset, offset + limit - 1)
                        .order('created_at', { ascending: false });

                    if (category) {
                        query = query.eq('category', category);
                    }

                    const { data, error } = await query;

                    if (error) throw error;
                    return { data: data || [] };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Quotes'],
        }),

        searchQuotes: builder.query<Quote[], { query: string }>({
            async queryFn({ query }) {
                try {
                    const { data, error } = await supabase
                        .from('quotes')
                        .select('*')
                        .or(`text.ilike.%${query}%,author.ilike.%${query}%`)
                        .limit(50);

                    if (error) throw error;
                    return { data: data || [] };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Quotes'],
        }),

        getQuoteOfTheDay: builder.query<Quote, void>({
            async queryFn() {
                try {
                    const { count } = await supabase
                        .from('quotes')
                        .select('*', { count: 'exact', head: true });

                    if (!count || count === 0) {
                        throw new Error('No quotes available');
                    }

                    const today = new Date();
                    const dayOfYear = Math.floor(
                        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
                    );
                    const quoteIndex = dayOfYear % count;

                    const { data, error } = await supabase
                        .from('quotes')
                        .select('*')
                        .range(quoteIndex, quoteIndex)
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Quotes'],
        }),


        getFavorites: builder.query<Favorite[], void>({
            async queryFn() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('favorites')
                        .select('*, quote:quotes(*)')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return { data: data || [] };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Favorites'],
        }),

        addFavorite: builder.mutation<Favorite, { quote: Quote }>({
            async queryFn({ quote }) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('favorites')
                        .insert({ user_id: user.id, quote_id: quote.id })
                        .select()
                        .single();

                    if (error) throw error;
                    return { data: { ...data, quote } };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            onQueryStarted: async ({ quote }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    supabaseApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                        // Check if already exists to avoid duplicates
                        if (!draft.find(f => f.quote_id === quote.id)) {
                            draft.unshift({
                                id: 'temp-' + Date.now(),
                                user_id: 'me',
                                quote_id: quote.id,
                                created_at: new Date().toISOString(),
                                quote: quote
                            });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Favorites'],
        }),

        removeFavorite: builder.mutation<void, { quote_id: string }>({
            async queryFn({ quote_id }) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { error } = await supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', user.id)
                        .eq('quote_id', quote_id);

                    if (error) throw error;
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            onQueryStarted: async ({ quote_id }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    supabaseApi.util.updateQueryData('getFavorites', undefined, (draft) => {
                        const index = draft.findIndex(f => f.quote_id === quote_id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Favorites'],
        }),


        getCollections: builder.query<Collection[], void>({
            async queryFn() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('collections')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return { data: data || [] };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Collections'],
        }),

        createCollection: builder.mutation<Collection, { name: string }>({
            async queryFn({ name }) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('collections')
                        .insert({ user_id: user.id, name })
                        .select()
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Collections'],
        }),

        deleteCollection: builder.mutation<void, { id: string }>({
            async queryFn({ id }) {
                try {
                    const { error } = await supabase
                        .from('collections')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Collections'],
        }),

        getCollectionQuotes: builder.query<CollectionQuote[], { collection_id: string }>({
            async queryFn({ collection_id }) {
                try {
                    const { data, error } = await supabase
                        .from('collection_quotes')
                        .select('*, quote:quotes(*)')
                        .eq('collection_id', collection_id);

                    if (error) throw error;
                    return { data: data || [] };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['Collections'],
        }),

        addQuoteToCollection: builder.mutation<CollectionQuote, { collection_id: string; quote: Quote }>({
            async queryFn({ collection_id, quote }) {
                try {
                    const { data, error } = await supabase
                        .from('collection_quotes')
                        .insert({ collection_id, quote_id: quote.id })
                        .select()
                        .single();

                    if (error) throw error;
                    return { data: { ...data, quote } };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            onQueryStarted: async ({ collection_id, quote }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    supabaseApi.util.updateQueryData('getCollectionQuotes', { collection_id }, (draft) => {
                        // Check if already exists
                        if (!draft.find(cq => cq.quote_id === quote.id)) {
                            draft.unshift({
                                id: 'temp-' + Date.now(),
                                collection_id: collection_id,
                                quote_id: quote.id,
                                quote: quote
                            });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Collections'],
        }),

        removeQuoteFromCollection: builder.mutation<void, { collection_id: string; quote_id: string }>({
            async queryFn({ collection_id, quote_id }) {
                try {
                    const { error } = await supabase
                        .from('collection_quotes')
                        .delete()
                        .eq('collection_id', collection_id)
                        .eq('quote_id', quote_id);

                    if (error) throw error;
                    return { data: undefined };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            onQueryStarted: async ({ collection_id, quote_id }, { dispatch, queryFulfilled }) => {
                const patchResult = dispatch(
                    supabaseApi.util.updateQueryData('getCollectionQuotes', { collection_id }, (draft) => {
                        const index = draft.findIndex(cq => cq.quote_id === quote_id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Collections'],
        }),


        getUserProfile: builder.query<UserProfile, void>({
            async queryFn() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['UserProfile'],
        }),

        updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
            async queryFn(updates) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('user_profiles')
                        .update(updates)
                        .eq('user_id', user.id)
                        .select()
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['UserProfile'],
        }),

        getUserSettings: builder.query<UserSettings, void>({
            async queryFn() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('user_settings')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            providesTags: ['UserSettings'],
        }),

        updateUserSettings: builder.mutation<UserSettings, Partial<UserSettings>>({
            async queryFn(updates) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('Not authenticated');

                    const { data, error } = await supabase
                        .from('user_settings')
                        .update(updates)
                        .eq('user_id', user.id)
                        .select()
                        .single();

                    if (error) throw error;
                    return { data };
                } catch (error: any) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['UserSettings'],
        }),
    }),
});

export const {
    useGetQuotesQuery,
    useSearchQuotesQuery,
    useGetQuoteOfTheDayQuery,
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
    useGetCollectionsQuery,
    useCreateCollectionMutation,
    useDeleteCollectionMutation,
    useGetCollectionQuotesQuery,
    useAddQuoteToCollectionMutation,
    useRemoveQuoteFromCollectionMutation,
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetUserSettingsQuery,
    useUpdateUserSettingsMutation,
} = supabaseApi;
