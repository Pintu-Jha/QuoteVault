import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { PrimaryButton } from './PrimaryButton';
import { typography, spacing } from '../../theme';

interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '📭',
    title,
    message,
    actionLabel,
    onAction,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
            {actionLabel && onAction && (
                <View style={styles.actionContainer}>
                    <PrimaryButton title={actionLabel} onPress={onAction} fullWidth={false} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    icon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    title: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.semiBold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        fontFamily: typography.fontFamily.ui,
        fontSize: typography.fontSize.body,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    actionContainer: {
        marginTop: spacing.md,
    },
});
