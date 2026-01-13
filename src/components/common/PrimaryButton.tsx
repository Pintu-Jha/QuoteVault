import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing, borderRadius, shadows } from '../../theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    fullWidth = true,
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: colors.primary },
                shadows.button,
                disabled && styles.disabled,
                fullWidth && styles.fullWidth,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}>
            {loading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        color: '#FFFFFF',
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    disabled: {
        opacity: 0.5,
    },
});
