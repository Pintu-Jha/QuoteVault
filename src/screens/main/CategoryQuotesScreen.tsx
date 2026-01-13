import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../contexts/ThemeContext';
import { useGetQuotesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoritesQuery } from '../../store/api/supabaseApi';
import { QuoteCard } from '../../components/QuoteCard';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { ExploreStackParamList, RootStackParamList } from '../../navigation/types';

type CategoryQuotesScreenProps = CompositeScreenProps<
    StackScreenProps<ExploreStackParamList, 'CategoryQuotes'>,
    StackScreenProps<RootStackParamList>
>;

export const CategoryQuotesScreen: React.FC<CategoryQuotesScreenProps> = ({ route, navigation }) => {
    const { categoryId, categoryName, categoryColor } = route.params;
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const { data: allQuotes = [], isLoading, error, refetch } = useGetQuotesQuery({
        category: categoryId,
        limit: 100
    });

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

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>{categoryName}</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Icon name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <View style={[styles.categoryBanner, { backgroundColor: categoryColor + '20' }]}>
                <View style={styles.bannerContent}>
                    <Text style={styles.categoryTitle}>{categoryName} Quotes</Text>
                    <Text style={styles.categoryCount}>
                        {allQuotes.length} {allQuotes.length === 1 ? 'quote' : 'quotes'} available
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading {categoryName.toLowerCase()} quotes...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Icon name="alert-circle-outline" size={48} color="#FF3B30" />
                        <Text style={styles.errorText}>Failed to load quotes</Text>
                        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : allQuotes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="document-text-outline" size={64} color="#666666" />
                        <Text style={styles.emptyTitle}>No Quotes Found</Text>
                        <Text style={styles.emptyText}>
                            There are no quotes in the {categoryName} category yet
                        </Text>
                    </View>
                ) : (
                    <View style={styles.quotesContainer}>
                        {allQuotes.map(quote => (
                            <QuoteCard
                                key={quote.id}
                                quote={quote}
                                isSaved={isFavorite(quote.id)}
                                onToggleSave={toggleFavorite}
                                showCategory={false}
                                onShare={(quote) => navigation.navigate('ShareQuote', { quote })}
                            />
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryBanner: {
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    bannerContent: {
        alignItems: 'center',
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    categoryCount: {
        fontSize: 14,
        color: '#888888',
    },
    quotesContainer: {
        paddingHorizontal: 0,
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
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 16,
        marginTop: 12,
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
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
});
