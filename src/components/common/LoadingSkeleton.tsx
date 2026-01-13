import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme';

export const LoadingSkeleton: React.FC = () => {
    const { colors } = useTheme();
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Animated.View
                style={[styles.quoteLine, { backgroundColor: colors.border, opacity }]}
            />
            <Animated.View
                style={[styles.quoteLine, { backgroundColor: colors.border, opacity, width: '90%' }]}
            />
            <Animated.View
                style={[styles.quoteLine, { backgroundColor: colors.border, opacity, width: '70%' }]}
            />
            <Animated.View
                style={[styles.authorLine, { backgroundColor: colors.border, opacity, marginTop: spacing.md }]}
            />
            <View style={styles.bottomRow}>
                <Animated.View
                    style={[styles.categoryBox, { backgroundColor: colors.border, opacity }]}
                />
                <View style={styles.actions}>
                    <Animated.View
                        style={[styles.iconBox, { backgroundColor: colors.border, opacity }]}
                    />
                    <Animated.View
                        style={[styles.iconBox, { backgroundColor: colors.border, opacity }]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.large,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        padding: spacing.lg,
    },
    quoteLine: {
        height: 24,
        borderRadius: 4,
        marginBottom: spacing.sm,
    },
    authorLine: {
        height: 18,
        width: '40%',
        borderRadius: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    categoryBox: {
        height: 28,
        width: 80,
        borderRadius: borderRadius.small,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    iconBox: {
        height: 32,
        width: 32,
        borderRadius: 16,
    },
});
