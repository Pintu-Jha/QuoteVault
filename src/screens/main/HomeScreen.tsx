import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    useGetQuotesQuery,
    useGetQuoteOfTheDayQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation,
    useGetFavoritesQuery,
} from '../../store/api/supabaseApi';
import { Quote } from '../../store/api/supabaseApi';
import { QuoteCard } from '../../components/QuoteCard';
import { AddToCollectionModal } from '../../components/AddToCollectionModal';

export const HomeScreen: React.FC = () => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', 'Motivation', 'Wisdom', 'Success', 'Love', 'Humor'];

    const { data: quoteOfTheDay, isLoading: qotdLoading, refetch: refetchQotd } = useGetQuoteOfTheDayQuery();
    const { data: quotes = [], isLoading: quotesLoading, refetch: refetchQuotes } = useGetQuotesQuery({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: 20,
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

    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    const handleAddToCollection = (quote: Quote) => {
        setSelectedQuote(quote);
        setShowCollectionModal(true);
    };

    const handleRefresh = async () => {
        await Promise.all([refetchQotd(), refetchQuotes()]);
    };

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    const getFormattedDate = () => {
        const date = new Date();
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    const getUserName = () => {
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    const getUserInitial = () => {
        return getUserName().charAt(0).toUpperCase();
    };

    const isLoading = qotdLoading || quotesLoading;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                    />
                }>
                <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                    <View>
                        <Text style={styles.date}>{getFormattedDate()}</Text>
                        <Text style={styles.greeting}>Good {getTimeOfDay()}, {getUserName()}</Text>
                    </View>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>{getUserInitial()}</Text>
                    </View>
                </View>

                {qotdLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : quoteOfTheDay ? (
                    <View style={styles.qotdSection}>
                        <View style={styles.qotdCard}>
                            <View style={styles.qotdBackground}>
                                <View style={styles.qotdOverlay} />
                            </View>

                            <View style={styles.qotdContent}>
                                <View style={[styles.qotdBadge, { backgroundColor: colors.primary + '33' }]}>
                                    <Text style={[styles.qotdBadgeText, { color: colors.primary }]}>
                                        QUOTE OF THE DAY
                                    </Text>
                                </View>
                                <Text style={styles.qotdText}>"{quoteOfTheDay.text}"</Text>
                                <View style={styles.qotdFooter}>
                                    <Text style={styles.qotdAuthor}>— {quoteOfTheDay.author}</Text>
                                    <TouchableOpacity
                                        style={styles.shareButton}
                                        onPress={() => navigation.navigate('ShareQuote', { quote: quoteOfTheDay })}
                                    >
                                        <Icon name="share-outline" size={18} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : null}

                {/* Explore Topics */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Explore Topics</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.topicsScroll}>
                        {categories.map(category => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.topicPill,
                                    selectedCategory === category && { backgroundColor: colors.primary },
                                ]}
                                onPress={() => setSelectedCategory(category)}>
                                <Text
                                    style={[
                                        styles.topicText,
                                        selectedCategory === category && styles.topicTextActive,
                                    ]}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Fresh Perspectives</Text>

                    {quotesLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={styles.loadingText}>Loading quotes...</Text>
                        </View>
                    ) : quotes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Icon name="document-text-outline" size={48} color="#666666" />
                            <Text style={styles.emptyText}>No quotes found in this category</Text>
                        </View>
                    ) : (
                        quotes.map(quote => (
                            <QuoteCard
                                key={quote.id}
                                quote={quote}
                                isSaved={isFavorite(quote.id)}
                                onToggleSave={toggleFavorite}
                                onAddToCollection={handleAddToCollection}
                                onShare={(quote) => navigation.navigate('ShareQuote', { quote })}
                            />
                        ))
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {selectedQuote && (
                <AddToCollectionModal
                    visible={showCollectionModal}
                    quote={selectedQuote}
                    onClose={() => {
                        setShowCollectionModal(false);
                        setSelectedQuote(null);
                    }}
                />
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
        alignItems: 'flex-start',
        padding: 20,
    },
    date: {
        fontSize: 11,
        color: '#666666',
        letterSpacing: 1,
        marginBottom: 4,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
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
    qotdSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    qotdCard: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 280,
    },
    qotdBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1A3A2A',
    },
    qotdOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    qotdContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    qotdBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    qotdBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
    },
    qotdText: {
        fontSize: 26,
        fontStyle: 'italic',
        fontFamily: 'Georgia',
        color: '#FFFFFF',
        lineHeight: 36,
        marginTop: 20,
    },
    qotdFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qotdAuthor: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    shareButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareIcon: {
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    topicsScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    topicPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        marginRight: 8,
    },
    topicText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    topicTextActive: {
        color: '#000000',
    },
    quoteCard: {
        backgroundColor: '#0D1F1A',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    quoteIcon: {
        fontSize: 24,
        marginBottom: 12,
    },
    quoteText: {
        fontSize: 18,
        fontStyle: 'italic',
        fontFamily: 'Georgia',
        color: '#FFFFFF',
        lineHeight: 28,
        marginBottom: 16,
    },
    quoteFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    author: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 2,
    },
    category: {
        fontSize: 11,
        color: '#666666',
    },
    actions: {
        flexDirection: 'row',
        gap: 16,
    },
    actionIcon: {
        fontSize: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#888888',
    },
});
