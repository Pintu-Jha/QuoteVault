import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing } from '../../theme';

interface ResetPasswordScreenProps {
    onNavigateBack: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
    onNavigateBack,
}) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await new Promise<void>(resolve => setTimeout(resolve, 1500));
            setSuccess(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>QuoteVault</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.successContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.successIcon}>✉️</Text>
                        </View>

                        <Text style={styles.successTitle}>Reset Link Sent</Text>
                        <Text style={styles.successMessage}>
                            Check your inbox for instructions to reset your password.
                        </Text>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: colors.primary }]}
                            onPress={onNavigateBack}>
                            <Text style={styles.buttonText}>Back to Login</Text>
                        </TouchableOpacity>

                        <View style={styles.resendSection}>
                            <Text style={styles.resendText}>
                                Didn't receive the email?{' '}
                                <Text style={[styles.resendLink, { color: colors.primary }]}>Resend</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Secure Password Recovery System{'\n'}
                            QuoteVault Encryption Protocol v2.4
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>QuoteVault</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>Recover Access</Text>
                    <Text style={styles.subtitle}>
                        Enter your email to receive a password reset link.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="name@email.com"
                                placeholderTextColor="#666666"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                            />
                        </View>
                    </View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleResetPassword}
                        disabled={loading}>
                        <Text style={styles.buttonText}>Send Reset Link →</Text>
                    </TouchableOpacity>

                    <View style={styles.loginSection}>
                        <Text style={styles.loginText}>
                            Remembered your password?{' '}
                            <Text style={[styles.loginLink, { color: colors.primary }]} onPress={() => onNavigateBack()}>
                                Login
                            </Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        If you continue to have trouble, please contact our{'\n'}
                        <Text style={styles.footerLink}>Support Team</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    titleSection: {
        marginBottom: 32,
    },
    title: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: typography.fontFamily.ui,
        fontSize: 15,
        lineHeight: 22,
        color: '#888888',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontFamily: typography.fontFamily.uiMedium,
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    input: {
        color: '#FFFFFF',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    error: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: 16,
        color: '#000000',
        fontWeight: '600',
    },
    loginSection: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#888888',
    },
    loginLink: {
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 32,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        color: '#666666',
    },
    footerLink: {
        textDecorationLine: 'underline',
    },
    successContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 200, 83, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    successIcon: {
        fontSize: 48,
    },
    successTitle: {
        fontFamily: typography.fontFamily.uiSemiBold,
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '700',
        marginBottom: 12,
    },
    successMessage: {
        fontFamily: typography.fontFamily.ui,
        fontSize: 15,
        lineHeight: 22,
        color: '#888888',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    resendSection: {
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
        color: '#888888',
    },
    resendLink: {
        fontWeight: '600',
    },
});
