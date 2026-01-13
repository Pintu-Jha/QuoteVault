import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography, spacing, borderRadius } from '../../theme';

interface InputFieldProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    error,
    autoCapitalize = 'none',
    keyboardType = 'default',
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        color: colors.textPrimary,
                        borderColor: error ? colors.error : colors.border,
                    },
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
            />
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontFamily: typography.fontFamily.uiMedium,
        fontSize: typography.fontSize.caption,
        marginBottom: spacing.sm,
    },
    input: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.medium,
        fontFamily: typography.fontFamily.ui,
        fontSize: typography.fontSize.body,
        borderWidth: 1,
    },
    error: {
        fontFamily: typography.fontFamily.ui,
        fontSize: typography.fontSize.caption,
        marginTop: spacing.xs,
    },
});
