import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '../../store/api/supabaseApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { QuoteCard } from '../../components/QuoteCard';

export const FavoritesScreen: React.FC = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const { data: favorites = [], isLoading, error, refetch } = useGetFavoritesQuery();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const handleRemoveFavorite = async (quote: any) => {
        try {
            await removeFavorite({ quote_id: quote.id }).unwrap();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View style={styles.titleRow}>
                    <Icon name="bookmark" size={24} color={colors.primary} />
                    <Text style={styles.title}>Saved Quotes</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{favorites.length}</Text>
                        <Text style={styles.statLabel}>Total Saved</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Saved Quotes</Text>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>Loading saved quotes...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Failed to load saved quotes</Text>
                            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : favorites.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Icon name="bookmark-outline" size={64} color="#666666" />
                            <Text style={styles.emptyTitle}>No Saved Quotes Yet</Text>
                            <Text style={styles.emptyText}>
                                Start saving quotes you love by tapping the bookmark icon
                            </Text>
                        </View>
                    ) : (
                        favorites.map((favorite) => {
                            const quote = favorite.quote;
                            if (!quote) return null;

                            return (
                                <QuoteCard
                                    key={favorite.id}
                                    quote={quote}
                                    isSaved={true}
                                    onToggleSave={handleRemoveFavorite}
                                    showCategory={true}
                                    onShare={(quote) => navigation.navigate('ShareQuote', { quote })}
                                />
                            );
                        })
                    )}
                </View>

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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#888888',
    },
    section: {
        paddingHorizontal: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#888888',
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
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
