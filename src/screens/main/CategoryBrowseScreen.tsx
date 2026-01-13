import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useGetQuotesQuery } from '../../store/api/supabaseApi';

const categories = [
    { id: 'Love', name: 'Love', iconName: 'heart-outline', color: '#FF1744' },
    { id: 'Wisdom', name: 'Wisdom', iconName: 'book-outline', color: '#536DFE' },
    { id: 'Success', name: 'Success', iconName: 'trophy-outline', color: '#FFD600' },
    { id: 'Motivation', name: 'Motivation', iconName: 'flash-outline', color: '#FF6D00' },
    { id: 'Humor', name: 'Humor', iconName: 'happy-outline', color: '#00C853' },
    { id: 'Life', name: 'Life', iconName: 'leaf-outline', color: '#00BFA5' },
];

const filters = ['All', 'Popular', 'Recent'];

import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ExploreStackParamList, RootStackParamList } from '../../navigation/types';

type CategoryBrowseScreenNavigationProp = CompositeNavigationProp<
    StackNavigationProp<ExploreStackParamList, 'CategoryBrowse'>,
    StackNavigationProp<RootStackParamList>
>;

interface CategoryBrowseScreenProps {
    navigation: CategoryBrowseScreenNavigationProp;
}

export const CategoryBrowseScreen: React.FC<CategoryBrowseScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data: allQuotes = [], isLoading } = useGetQuotesQuery({ limit: 1000 });

    const getCategoryCount = (categoryName: string) => {
        return allQuotes.filter(q => q.category === categoryName).length;
    };

    const getTotalQuotes = () => {
        return allQuotes.length;
    };

    const handleCategoryPress = (category: typeof categories[0]) => {
        setSelectedCategory(category.id);
        navigation.navigate('CategoryQuotes', {
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
        });
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View style={styles.titleRow}>
                    <Icon name="grid" size={24} color={colors.primary} />
                    <Text style={styles.title}>Explore</Text>
                </View>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation?.navigate('Search')}>
                    <Icon name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Icon name="library-outline" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{getTotalQuotes()}</Text>
                        <Text style={styles.statLabel}>Total Quotes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Icon name="grid-outline" size={32} color={colors.primary} />
                        <Text style={styles.statValue}>{categories.length}</Text>
                        <Text style={styles.statLabel}>Categories</Text>
                    </View>
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>Filter By</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersScroll}>
                        {filters.map(filter => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterPill,
                                    selectedFilter === filter && { backgroundColor: colors.primary },
                                ]}
                                onPress={() => setSelectedFilter(filter)}>
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilter === filter && styles.filterTextActive,
                                    ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Browse by Category</Text>
                        <Icon name="albums-outline" size={20} color={colors.primary} />
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>Loading categories...</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {categories.map((category, index) => {
                                const count = getCategoryCount(category.id);
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryCard,
                                            index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                                        ]}
                                        onPress={() => handleCategoryPress(category)}>
                                        <View style={styles.cardContent}>
                                            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                                                <Icon name={category.iconName} size={28} color={category.color} />
                                            </View>
                                            <Text style={styles.categoryName}>{category.name}</Text>
                                            <View style={styles.countBadge}>
                                                <Icon name="document-text-outline" size={12} color="#888888" />
                                                <Text style={styles.categoryCount}>
                                                    {count} {count === 1 ? 'quote' : 'quotes'}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                <View style={styles.trendingSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <Icon name="trending-up" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.sectionSubtitle}>
                        Discover the most loved quotes from our community
                    </Text>
                    <TouchableOpacity
                        style={[styles.trendingButton, { borderColor: colors.primary }]}
                        onPress={() => navigation?.navigate('MainTabs')}>
                        <Text style={[styles.trendingButtonText, { color: colors.primary }]}>
                            View Trending Quotes
                        </Text>
                        <Icon name="arrow-forward" size={16} color={colors.primary} />
                    </TouchableOpacity>
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
        fontSize: 24,
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
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#2A2A2A',
        marginHorizontal: 16,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#888888',
    },
    filterSection: {
        marginBottom: 24,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888888',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    filtersScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    filterTextActive: {
        color: '#000000',
    },
    categoriesSection: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    categoryCard: {
        width: '50%',
        padding: 8,
        marginBottom: 16,
    },
    cardLeft: {
        paddingRight: 8,
    },
    cardRight: {
        paddingLeft: 8,
    },
    cardContent: {
        backgroundColor: '#0D0D0D',
        borderRadius: 16,
        padding: 20,
        height: 160,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 8,
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    categoryCount: {
        fontSize: 11,
        color: '#888888',
        letterSpacing: 0.5,
    },
    trendingSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#888888',
        lineHeight: 20,
        marginBottom: 16,
    },
    trendingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    trendingButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
