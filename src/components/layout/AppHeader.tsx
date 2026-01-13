import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing } from '../../theme';

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    onBackPress?: () => void;
    rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    subtitle,
    onBackPress,
    rightAction,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
            <View style={styles.leftSection}>
                {onBackPress && (
                    <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                        <Text style={[styles.backIcon, { color: colors.textPrimary }]}>←</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {rightAction && <View style={styles.rightSection}>{rightAction}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: spacing.md,
    },
    backIcon: {
        fontSize: 28,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: typography.fontSize.title,
        fontWeight: typography.fontWeight.semiBold,
    },
    subtitle: {
        fontFamily: typography.fontFamily.ui,
        fontSize: typography.fontSize.caption,
        marginTop: 2,
    },
    rightSection: {
        marginLeft: spacing.md,
    },
});
