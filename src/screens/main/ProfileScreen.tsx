import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGetUserProfileQuery, useGetFavoritesQuery, useGetCollectionsQuery } from '../../store/api/supabaseApi';
import { typography, spacing } from '../../theme';

interface ProfileScreenProps {
    navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();

    const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery(undefined, {
        skip: !user,
    });
    const { data: favorites = [], isLoading: favoritesLoading } = useGetFavoritesQuery(undefined, {
        skip: !user,
    });
    const { data: collections = [], isLoading: collectionsLoading } = useGetCollectionsQuery(undefined, {
        skip: !user,
    });

    const getUserInitials = () => {
        const name = userProfile?.name || user?.email || 'U';
        return name.charAt(0).toUpperCase();
    };

    const getDisplayName = () => {
        if (userProfile?.name) return userProfile.name;
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    const menuItems = [
        {
            section: 'PERSONAL',
            items: [
                { iconName: 'folder-outline', title: 'My Collections', color: '#4A9EFF', action: () => navigation?.navigate('Collections') },
                { iconName: 'person-circle-outline', title: 'Account Settings', color: '#4A9EFF', action: () => navigation?.navigate('Settings') },
                { iconName: 'notifications-outline', title: 'Notifications', color: '#4A9EFF' },
            ],
        },
        {
            section: 'SUPPORT',
            items: [
                { iconName: 'help-circle-outline', title: 'Help & Support', color: '#888888' },
                { iconName: 'document-text-outline', title: 'Terms & Privacy', color: '#888888' },
                { iconName: 'log-out-outline', title: 'Logout', color: '#FF3B30', action: logout },
            ],
        },
    ];

    const isLoading = profileLoading || favoritesLoading || collectionsLoading;

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getUserInitials()}</Text>
                        </View>
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <Icon name="pencil" size={14} color="#FFFFFF" />
                        </View>
                    </View>

                    <Text style={styles.name}>{getDisplayName()}</Text>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>

                    {isLoading ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <View style={styles.stats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{favorites.length}</Text>
                                <Text style={styles.statLabel}>FAVORITES</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{collections.length}</Text>
                                <Text style={styles.statLabel}>COLLECTIONS</Text>
                            </View>
                        </View>
                    )}
                </View>

                {menuItems.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.menuSection}>
                        <Text style={styles.sectionTitle}>{section.section}</Text>
                        {section.items.map((item, itemIndex) => (
                            <TouchableOpacity
                                key={itemIndex}
                                style={styles.menuItem}
                                onPress={item.action}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                        <Icon name={item.iconName} size={20} color={item.color} />
                                    </View>
                                    <Text style={[styles.menuTitle, item.color === '#FF3B30' && { color: item.color }]}>
                                        {item.title}
                                    </Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color="#666666" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

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
        justifyContent: 'center',
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
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    moreIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    avatarEmoji: {
        fontSize: 48,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000000',
    },
    editIcon: {
        fontSize: 14,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 24,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#666666',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#333333',
    },
    menuSection: {
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
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
        marginHorizontal: 20,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
    },
    menuItemLeft: {
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
    menuIcon: {
        fontSize: 20,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    chevron: {
        fontSize: 24,
        color: '#666666',
    },
    bottomPadding: {
        height: 100,
    },
});
