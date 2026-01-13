import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearchQuotesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoritesQuery } from '../../store/api/supabaseApi';
import { typography, spacing } from '../../theme';

export const SearchScreen: React.FC = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'Quotes' | 'Authors'>('Quotes');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: searchResults = [], isLoading } = useSearchQuotesQuery(
        { query: debouncedQuery },
        { skip: debouncedQuery.length < 2 }
    );

    const { data: favorites = [] } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const isFavorite = (quoteId: string) => {
        return favorites.some(fav => fav.quote_id === quoteId);
    };

    const toggleFavorite = async (quote: any) => {
        try {
            if (isFavorite(quote.id)) {
                await removeFavorite({ quote_id: quote.id }).unwrap();
            } else {
                await addFavorite({ quote: quote }).unwrap();
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const renderQuoteCard = (item: any) => {
        const favorite = isFavorite(item.id);

        return (
            <View key={item.id} style={styles.quoteCard}>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={styles.categoryBadge}>
                            <Text style={[styles.category, { color: colors.primary }]}>{item.category.toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon name="ellipsis-horizontal" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.quoteText}>"{item.text}"</Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.authorSection}>
                            <View style={[styles.authorAvatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.avatarText}>{item.author.charAt(0)}</Text>
                            </View>
                            <Text style={styles.author}>— {item.author}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity>
                                <Icon name="share-outline" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: favorite ? colors.primary : '#1A1A1A' }]}
                                onPress={() => toggleFavorite(item)}>
                                <Icon name={favorite ? 'bookmark' : 'bookmark-outline'} size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={20} color="#666666" style={{ marginRight: 12 }} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by keyword or author..."
                        placeholderTextColor="#666666"
                        style={styles.searchInput}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close-circle" size={20} color="#666666" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Quotes' && styles.tabActive]}
                        onPress={() => setActiveTab('Quotes')}>
                        <Text style={[styles.tabText, activeTab === 'Quotes' && styles.tabTextActive]}>
                            Quotes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Authors' && styles.tabActive]}
                        onPress={() => setActiveTab('Authors')}>
                        <Text style={[styles.tabText, activeTab === 'Authors' && styles.tabTextActive]}>
                            Authors
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {debouncedQuery.length < 2 ? (
                        <View style={styles.emptyState}>
                            <Icon name="search-outline" size={64} color="#666666" />
                            <Text style={styles.emptyTitle}>Search for Quotes</Text>
                            <Text style={styles.emptyText}>
                                Type at least 2 characters to search for quotes by text or author
                            </Text>
                        </View>
                    ) : isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>Searching...</Text>
                        </View>
                    ) : searchResults.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="document-text-outline" size={64} color="#666666" />
                            <Text style={styles.emptyTitle}>No Results Found</Text>
                            <Text style={styles.emptyText}>
                                Try searching with different keywords
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>
                                {searchResults.length} RESULT{searchResults.length !== 1 ? 'S' : ''}
                            </Text>
                            {searchResults.map(quote => renderQuoteCard(quote))}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    searchSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
    },
    tabs: {
        flexDirection: 'row',
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#2A4A3A',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888888',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    content: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666666',
        letterSpacing: 1,
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        color: '#888888',
        marginTop: 12,
        fontSize: 14,
    },
    quoteCard: {
        marginBottom: 16,
        backgroundColor: '#0D1F1A',
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#1A3A2A',
        borderRadius: 12,
    },
    category: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        fontFamily: 'Georgia',
        color: '#FFFFFF',
        lineHeight: 24,
        marginVertical: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    author: {
        fontSize: 13,
        color: '#FFFFFF',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    saveButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
