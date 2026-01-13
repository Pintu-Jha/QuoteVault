import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme';

interface LoginScreenProps {
    onNavigateToSignUp: () => void;
    onNavigateToResetPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    onNavigateToSignUp,
    onNavigateToResetPassword,
}) => {
    const { colors } = useTheme();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Login failed. Please try again.');
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
                    <TouchableOpacity onPress={onNavigateToSignUp} style={styles.backButton}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>QuoteVault</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>
                        Access your stored wisdom and insights.
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

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: colors.primary }]}
                        onPress={handleLogin}
                        disabled={loading}>
                        <Text style={styles.buttonText}>Login →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onNavigateToResetPassword} style={styles.forgotPassword}>
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpSection}>
                        <Text style={styles.signUpText}>
                            Don't have an account?{' '}
                            <Text style={[styles.signUpLink, { color: colors.primary }]} onPress={onNavigateToSignUp}>
                                Sign Up
                            </Text>
                        </Text>
                    </View>
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
    loginButton: {
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
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotText: {
        fontSize: 14,
        color: '#888888',
    },
    signUpSection: {
        marginTop: 24,
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#888888',
    },
    signUpLink: {
        fontWeight: '600',
    },
});
