import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing, borderRadius } from '../../theme';

interface SearchInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <Text style={styles.icon}>🔍</Text>
            <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
            />
            {value.length > 0 && onClear && (
                <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                    <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.medium,
        gap: spacing.sm,
    },
    icon: {
        fontSize: 20,
    },
    input: {
        flex: 1,
        fontFamily: typography.fontFamily.ui,
        fontSize: typography.fontSize.body,
        padding: 0,
    },
    clearButton: {
        padding: spacing.xs,
    },
    clearIcon: {
        fontSize: 18,
    },
});
