import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing } from '../../theme';

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const { colors } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.appName}>QuoteVault</Text>
                <Text style={styles.tagline}>SAVE WORDS THAT MOVE YOU</Text>
            </View>

            <View style={styles.loadingSection}>
                <Text style={styles.loadingText}>INITIALISING LIBRARY</Text>
                <ActivityIndicator color={colors.primary} size="small" style={styles.loader} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        justifyContent: 'space-between',
        paddingVertical: 80,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontFamily: 'Georgia',
        fontSize: 42,
        fontStyle: 'italic',
        color: '#FFFFFF',
        marginBottom: 16,
        letterSpacing: 1,
    },
    tagline: {
        fontFamily: typography.fontFamily.ui,
        fontSize: 11,
        letterSpacing: 2.5,
        fontWeight: '300',
        color: '#888888',
    },
    loadingSection: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    loadingText: {
        fontFamily: typography.fontFamily.ui,
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 16,
        color: '#666666',
    },
    loader: {
        marginTop: 8,
    },
});
