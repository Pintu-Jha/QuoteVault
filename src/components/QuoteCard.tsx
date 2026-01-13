import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';

import { Quote } from '../store/api/supabaseApi';


interface QuoteCardProps {
    quote: Quote;
    isSaved: boolean;
    onToggleSave: (quote: Quote) => void;
    onShare?: (quote: Quote) => void;
    onAddToCollection?: (quote: Quote) => void;
    isInCollection?: boolean;
    showCategory?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
    quote,
    isSaved,
    onToggleSave,
    onShare,
    onAddToCollection,
    isInCollection = false,
    showCategory = true,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.quoteCard}>
            <Icon name="chatbubble-outline" size={24} color={colors.primary} style={{ marginBottom: 12 }} />
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <View style={styles.quoteFooter}>
                <View>
                    <Text style={styles.author}>{quote.author}</Text>
                    {showCategory && <Text style={styles.category}>#{quote.category}</Text>}
                </View>
                <View style={styles.actions}>
                    {onAddToCollection && (
                        <TouchableOpacity onPress={() => onAddToCollection(quote)}>
                            <Icon
                                name={isInCollection ? 'checkmark-circle' : 'add-circle-outline'}
                                size={22}
                                color={isInCollection ? colors.primary : '#FFFFFF'}
                            />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => onToggleSave(quote)}>
                        <Icon
                            name={isSaved ? 'bookmark' : 'bookmark-outline'}
                            size={22}
                            color={isSaved ? colors.primary : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                    {onShare && (
                        <TouchableOpacity onPress={() => onShare(quote)}>
                            <Icon name="share-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    quoteCard: {
        backgroundColor: '#0D1F1A',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
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
});
