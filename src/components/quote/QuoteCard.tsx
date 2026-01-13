import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Quote } from '../../types';
import { typography, spacing, borderRadius, shadows } from '../../theme';

interface QuoteCardProps {
    quote: Quote;
    onPress?: () => void;
    onShare?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onPress, onShare }) => {
    const { colors } = useTheme();
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(quote.id);

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }, shadows.card]}
            onPress={onPress}
            activeOpacity={0.9}>
            <View style={styles.content}>
                <Text style={[styles.quoteText, { color: colors.textPrimary }]}>
                    "{quote.text}"
                </Text>

                <Text style={[styles.author, { color: colors.textSecondary }]}>
                    — {quote.author}
                </Text>

                <View style={styles.bottomRow}>
                    {quote.category && (
                        <View style={[styles.categoryChip, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.categoryText, { color: colors.primary }]}>
                                {quote.category}
                            </Text>
                        </View>
                    )}

                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => toggleFavorite(quote)}
                            style={styles.actionButton}>
                            <Text style={[styles.icon, { color: favorite ? colors.favorite : colors.textSecondary }]}>
                                {favorite ? '❤️' : '🤍'}
                            </Text>
                        </TouchableOpacity>

                        {onShare && (
                            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                                <Text style={[styles.icon, { color: colors.textSecondary }]}>
                                    📤
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.large,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        padding: spacing.lg,
    },
    content: {
        gap: spacing.md,
    },
    quoteText: {
        fontFamily: typography.fontFamily.quote,
        fontSize: typography.fontSize.hero,
        lineHeight: typography.lineHeight.hero,
        fontWeight: typography.fontWeight.semiBold,
    },
    author: {
        fontFamily: typography.fontFamily.uiMedium,
        fontSize: typography.fontSize.title,
        lineHeight: typography.lineHeight.title,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    categoryChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.small,
    },
    categoryText: {
        fontFamily: typography.fontFamily.uiMedium,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.medium,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    actionButton: {
        padding: spacing.sm,
    },
    icon: {
        fontSize: 24,
    },
});
