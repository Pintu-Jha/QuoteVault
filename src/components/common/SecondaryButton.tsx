import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing, borderRadius } from '../../theme';

interface SecondaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    title,
    onPress,
    disabled = false,
    fullWidth = true,
}) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { borderColor: colors.primary },
                disabled && styles.disabled,
                fullWidth && styles.fullWidth,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}>
            <Text style={[styles.text, { color: colors.primary }]}>{title}</Text>
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
        borderWidth: 2,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.semiBold,
    },
    disabled: {
        opacity: 0.5,
    },
});
