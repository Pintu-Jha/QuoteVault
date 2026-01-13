import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { supabaseApi, useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '../../store/api/supabaseApi';
import { seedQuotes } from '../../utils/seeder';

const accentColors = [
    { id: 'teal', color: '#00BFA5' },
    { id: 'blue', color: '#4A9EFF' },
    { id: 'red', color: '#FF5252' },
    { id: 'green', color: '#00C853' },
    { id: 'orange', color: '#FF9800' },
];

export const SettingsScreen: React.FC = () => {
    const { colors, mode, toggleTheme } = useTheme();
    const navigation = useNavigation();
    const isDarkMode = mode === 'dark';
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const { data: settings, isLoading } = useGetUserSettingsQuery();
    const [updateSettings] = useUpdateUserSettingsMutation();

    const [selectedAccent, setSelectedAccent] = useState('green');
    const [fontSize, setFontSize] = useState(1);
    const [spaciousLayout, setSpaciousLayout] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [notificationTime, setNotificationTime] = useState('08:30 AM');
    const [seeding, setSeeding] = useState(false);

    React.useEffect(() => {
        if (settings) {
            setSelectedAccent(settings.accent_color || 'green');
            setFontSize(settings.font_size || 1);
            setNotificationsEnabled(settings.notifications_enabled ?? true);
            setNotificationTime(settings.notification_time || '08:30 AM');
        }
    }, [settings]);

    const handleUpdateSetting = async (key: string, value: any) => {
        try {
            if (key === 'accent_color') setSelectedAccent(value);
            if (key === 'font_size') setFontSize(value);
            if (key === 'notifications_enabled') setNotificationsEnabled(value);
            if (key === 'notification_time') setNotificationTime(value);

            await updateSettings({ [key]: value }).unwrap();
        } catch (error) {
            console.error('Failed to update settings:', error);
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const handleSeedQuotes = async () => {
        setSeeding(true);
        const result = await seedQuotes();
        setSeeding(false);
        if (result.success) {
            Alert.alert('Success', `Successfully seeded ${result.count} quotes!`);
            dispatch(supabaseApi.util.invalidateTags(['Quotes']));
        } else {
            Alert.alert('Error', 'Failed to seed quotes. Check console for details.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>APPEARANCE</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                                <Icon name="moon" size={20} color="#4A9EFF" />
                            </View>
                            <Text style={styles.settingTitle}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#3A3A3A', true: '#00C853' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRowColumn}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                                <Icon name="color-palette" size={20} color="#4A9EFF" />
                            </View>
                            <View>
                                <Text style={styles.settingTitle}>Accent Color</Text>
                                <Text style={styles.settingSubtitle}>Choose your highlight theme</Text>
                            </View>
                        </View>
                        <View style={styles.colorPicker}>
                            {accentColors.map(accent => (
                                <TouchableOpacity
                                    key={accent.id}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: accent.color },
                                        selectedAccent === accent.id && styles.colorOptionSelected,
                                    ]}
                                    onPress={() => handleUpdateSetting('accent_color', accent.id)}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TEXT & DISPLAY</Text>

                    <View style={styles.settingRowColumn}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                                <Icon name="text" size={20} color="#4A9EFF" />
                            </View>
                            <Text style={styles.settingTitle}>Font Size</Text>
                        </View>
                        <View style={styles.fontSizeControl}>
                            <Text style={styles.fontSizeLabel}>SMALL</Text>
                            <View style={styles.sliderContainer}>
                                <View style={styles.sliderTrack}>
                                    <View style={[styles.sliderFill, { width: `${(fontSize / 2) * 100}%` }]} />
                                    <View
                                        style={[
                                            styles.sliderThumb,
                                            { left: `${(fontSize / 2) * 100}%` },
                                        ]}
                                    />
                                </View>
                            </View>
                            <Text style={styles.fontSizeLabel}>LARGE</Text>
                        </View>
                    </View>



                    <View style={styles.settingLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                            <Text style={styles.settingIcon}>📐</Text>
                        </View>
                        <Text style={styles.settingTitle}>Spacious Layout</Text>
                    </View>
                    <Switch
                        value={spaciousLayout}
                        onValueChange={setSpaciousLayout}
                        trackColor={{ false: '#3A3A3A', true: '#00C853' }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                                <Icon name="notifications" size={20} color="#4A9EFF" />
                            </View>
                            <Text style={styles.settingTitle}>Daily Quote</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={(val) => handleUpdateSetting('notifications_enabled', val)}
                            trackColor={{ false: '#3A3A3A', true: '#00C853' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#4A9EFF20' }]}>
                                <Icon name="time" size={20} color="#4A9EFF" />
                            </View>
                            <Text style={styles.settingTitle}>Delivery Time</Text>
                        </View>
                        <Text style={[styles.timeValue, { color: colors.primary }]}>{notificationTime}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DEVELOPER</Text>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleSeedQuotes}
                        disabled={seeding}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: '#FF3B3020' }]}>
                                <Icon name="cloud-download" size={20} color="#FF3B30" />
                            </View>
                            <Text style={styles.settingTitle}>
                                {seeding ? 'Seeding Quotes...' : 'Seed Database'}
                            </Text>
                        </View>
                        {seeding && <ActivityIndicator size="small" color={colors.primary} />}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerLink}>
                        <Text style={styles.footerLinkText}>Privacy Policy</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerLink}>
                        <Text style={styles.footerLinkText}>Terms of Service</Text>
                        <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    <View style={styles.versionContainer}>
                        <Text style={styles.versionLabel}>App Version</Text>
                        <Text style={styles.versionValue}>2.4.0 (Build 12)</Text>
                    </View>
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666666',
        letterSpacing: 1,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
    },
    settingRowColumn: {
        backgroundColor: '#1A1A1A',
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingIcon: {
        fontSize: 20,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#888888',
        marginTop: 2,
    },
    colorPicker: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    colorOptionSelected: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    fontSizeControl: {
        marginTop: 16,
    },
    fontSizeLabel: {
        fontSize: 10,
        color: '#666666',
        letterSpacing: 1,
    },
    sliderContainer: {
        marginVertical: 12,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#3A3A3A',
        borderRadius: 2,
        position: 'relative',
    },
    sliderFill: {
        height: 4,
        backgroundColor: '#00C853',
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        top: -6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginLeft: -8,
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 20,
        marginTop: 16,
    },
    footerLink: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    footerLinkText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    chevron: {
        fontSize: 20,
        color: '#666666',
    },
    versionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    versionLabel: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    versionValue: {
        fontSize: 14,
        color: '#666666',
    },
    bottomPadding: {
        height: 100,
    },
});
