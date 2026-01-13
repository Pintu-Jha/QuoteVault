import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { typography, spacing } from '../../theme';

interface SignUpScreenProps {
    onNavigateToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin }) => {
    const { colors } = useTheme();
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await signup('User', email, password);
        } catch (err) {
            setError('Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onNavigateToLogin} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>QuoteVault</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>Join the Vault</Text>
                    <Text style={styles.subtitle}>
                        Secure your curated collection of wisdom.
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#666666"
                                secureTextEntry={!showPassword}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#666666"
                                secureTextEntry={!showConfirmPassword}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                                <Text style={styles.eyeText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: colors.primary }]}
                        onPress={handleSignUp}
                        disabled={loading}>
                        <Text style={styles.buttonText}>Create Account →</Text>
                    </TouchableOpacity>

                    <View style={styles.loginSection}>
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                            <Text style={[styles.loginLink, { color: colors.primary }]} onPress={onNavigateToLogin}>
                                Login
                            </Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.footerLink}>Privacy Policy</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    eyeIcon: {
        padding: 16,
    },
    eyeText: {
        fontSize: 18,
    },
    error: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    createButton: {
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
});
