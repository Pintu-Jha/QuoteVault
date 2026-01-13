import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useGetCollectionsQuery, useCreateCollectionMutation, useDeleteCollectionMutation } from '../../store/api/supabaseApi';
import { typography, spacing } from '../../theme';

const collectionIcons = ['star', 'briefcase', 'library', 'bulb', 'book', 'trophy', 'heart', 'diamond'];
const collectionColors = ['#D2691E', '#4682B4', '#DAA520', '#FF6347', '#9B59B6', '#1ABC9C', '#E74C3C', '#F39C12'];

interface CollectionsScreenProps {
    navigation?: any;
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [modalVisible, setModalVisible] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    const { data: collections = [], isLoading, error, refetch } = useGetCollectionsQuery();
    const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
    const [deleteCollection] = useDeleteCollectionMutation();

    const handleCreateCollection = async () => {
        if (newCollectionName.trim()) {
            try {
                await createCollection({ name: newCollectionName.trim() }).unwrap();
                setNewCollectionName('');
                setModalVisible(false);
            } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to create collection');
            }
        }
    };

    const handleDeleteCollection = async (id: string, name: string) => {
        Alert.alert(
            'Delete Collection',
            `Are you sure you want to delete "${name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCollection({ id }).unwrap();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete collection');
                        }
                    },
                },
            ]
        );
    };

    const getCollectionStyle = (index: number) => ({
        icon: collectionIcons[index % collectionIcons.length],
        color: collectionColors[index % collectionColors.length],
    });

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View style={styles.titleRow}>
                    <Icon name="grid" size={24} color={colors.primary} />
                    <Text style={styles.title}>Your Collections</Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Icon name="search" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: colors.primary }]}
                    onPress={() => setModalVisible(true)}
                    disabled={isCreating}>
                    <Icon name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.createButtonText}>
                        {isCreating ? 'Creating...' : 'Create New Collection'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Collections</Text>
                        <Text style={styles.totalCount}>{collections.length} total</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.loadingText}>Loading collections...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Failed to load collections</Text>
                            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : collections.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Icon name="folder-open-outline" size={64} color="#666666" />
                            <Text style={styles.emptyTitle}>No Collections Yet</Text>
                            <Text style={styles.emptyText}>
                                Create your first collection to organize your favorite quotes
                            </Text>
                        </View>
                    ) : (
                        collections.map((collection, index) => {
                            const style = getCollectionStyle(index);
                            return (
                                <View key={collection.id} style={styles.collectionCard}>
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardTop}>
                                            <View>
                                                <Text style={styles.collectionName}>{collection.name}</Text>
                                                <Text style={styles.quoteCount}>0 Quotes</Text>
                                            </View>
                                            <View style={[styles.iconContainer, { backgroundColor: style.color }]}>
                                                <Icon name={style.icon} size={24} color="#FFFFFF" />
                                            </View>
                                        </View>

                                        <View style={styles.cardBottom}>
                                            <TouchableOpacity
                                                style={styles.openVaultButton}
                                                onPress={() => navigation?.navigate('CollectionDetail', {
                                                    collectionId: collection.id,
                                                    collectionName: collection.name,
                                                })}>
                                                <Text style={styles.openVaultText}>Open Vault</Text>
                                                <Icon name="chevron-forward" size={20} color="#FFFFFF" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleDeleteCollection(collection.id, collection.name)}>
                                                <Icon name="trash-outline" size={20} color="#FF3B30" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Collection</Text>
                        <TextInput
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            placeholder="Collection name"
                            placeholderTextColor="#666666"
                            style={styles.modalInput}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => {
                                    setModalVisible(false);
                                    setNewCollectionName('');
                                }}>
                                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButtonCreate, { backgroundColor: colors.primary }]}
                                onPress={handleCreateCollection}
                                disabled={isCreating || !newCollectionName.trim()}>
                                <Text style={styles.modalButtonTextCreate}>
                                    {isCreating ? 'Creating...' : 'Create'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    icon: {
        fontSize: 24,
        color: '#D2691E',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 18,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 24,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    plusIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    section: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    totalCount: {
        fontSize: 13,
        color: '#666666',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#888888',
        marginTop: 12,
        fontSize: 14,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        marginBottom: 12,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    collectionCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 20,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    collectionName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    quoteCount: {
        fontSize: 13,
        color: '#888888',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionIcon: {
        fontSize: 24,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    openVaultButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    openVaultText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    chevron: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    favoriteIcon: {
        fontSize: 20,
    },
    moreIcon: {
        fontSize: 20,
        color: '#666666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    modalInput: {
        backgroundColor: '#0D0D0D',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButtonCancel: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
    },
    modalButtonTextCancel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalButtonCreate: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonTextCreate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});
