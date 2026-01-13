import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import {
    useGetCollectionQuotesQuery,
    useRemoveQuoteFromCollectionMutation,
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation
} from '../../store/api/supabaseApi';
import { QuoteCard } from '../../components/QuoteCard';

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';

type CollectionDetailScreenProps = StackScreenProps<RootStackParamList, 'CollectionDetail'>;

export const CollectionDetailScreen: React.FC<CollectionDetailScreenProps> = ({ route, navigation }) => {
    const { collectionId, collectionName } = route.params;
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const { data: collectionQuotes = [], isLoading, error, refetch } = useGetCollectionQuotesQuery({
        collection_id: collectionId
    });

    const { data: favorites = [] } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [removeQuoteFromCollection] = useRemoveQuoteFromCollectionMutation();

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

    const handleRemoveFromCollection = async (quoteId: string) => {
        Alert.alert(
            'Remove Quote',
            'Remove this quote from the collection?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeQuoteFromCollection({
                                collection_id: collectionId,
                                quote_id: quoteId
                            }).unwrap();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to remove quote');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>{collectionName}</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.collectionInfo}>
                <View style={[styles.collectionIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Icon name="folder-open" size={32} color={colors.primary} />
                </View>
                <Text style={styles.collectionTitle}>{collectionName}</Text>
                <Text style={styles.quoteCount}>
                    {collectionQuotes.length} {collectionQuotes.length === 1 ? 'quote' : 'quotes'}
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading collection...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Icon name="alert-circle-outline" size={48} color="#FF3B30" />
                        <Text style={styles.errorText}>Failed to load collection</Text>
                        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : collectionQuotes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Icon name="folder-open-outline" size={64} color="#666666" />
                        </View>
                        <Text style={styles.emptyTitle}>Your Vault is Empty</Text>
                        <Text style={styles.emptyText}>
                            Create your first collection to start organizing your favorite wisdom
                        </Text>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate('MainTabs')}>
                            <Icon name="add-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.addButtonText}>Browse Quotes</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.quotesContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Quotes in this Collection</Text>
                        </View>
                        {collectionQuotes.map((item) => {
                            const quote = item.quote;
                            if (!quote) return null;

                            return (
                                <View key={item.id} style={styles.quoteWrapper}>
                                    <QuoteCard
                                        quote={quote}
                                        isSaved={isFavorite(quote.id)}
                                        onToggleSave={toggleFavorite}
                                        showCategory={true}
                                        onShare={(quote) => navigation.navigate('ShareQuote', { quote })}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => handleRemoveFromCollection(quote.id)}>
                                        <Icon name="close-circle" size={20} color="#FF3B30" />
                                        <Text style={styles.removeText}>Remove from collection</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {collectionQuotes.length > 0 && (
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        Alert.alert('Add Quotes', 'Feature coming soon!');
                    }}>
                    <Icon name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            )}
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
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 12,
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    placeholder: {
        width: 40,
    },
    collectionInfo: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    collectionIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    collectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    quoteCount: {
        fontSize: 14,
        color: '#888888',
    },
    quotesContainer: {
        paddingHorizontal: 0,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    quoteWrapper: {
        marginBottom: 8,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    removeText: {
        fontSize: 13,
        color: '#FF3B30',
        fontWeight: '500',
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
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});
