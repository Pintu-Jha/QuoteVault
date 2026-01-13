import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing, borderRadius } from '../../theme';

interface CategoryPillProps {
    label: string;
    active?: boolean;
    onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
    label,
    active = false,
    onPress,
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.pill,
                {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text
                style={[
                    styles.text,
                    { color: active ? '#FFFFFF' : colors.textPrimary },
                ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.small,
        borderWidth: 1,
        marginRight: spacing.sm,
    },
    text: {
        fontFamily: typography.fontFamily.uiMedium,
        fontSize: typography.fontSize.caption,
        fontWeight: typography.fontWeight.medium,
    },
});
