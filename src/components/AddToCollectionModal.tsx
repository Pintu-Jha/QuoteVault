import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { useGetCollectionsQuery, useAddQuoteToCollectionMutation, useGetCollectionQuotesQuery, Quote } from '../store/api/supabaseApi';

interface AddToCollectionModalProps {
    visible: boolean;
    quote: Quote;
    onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ visible, quote, onClose }) => {
    const { colors } = useTheme();
    const { data: collections = [], isLoading } = useGetCollectionsQuery();
    const [addQuoteToCollection, { isLoading: isAdding }] = useAddQuoteToCollectionMutation();

    const isQuoteInCollection = (collectionId: string) => {
        return false;
    };

    const handleAddToCollection = async (collectionId: string, collectionName: string) => {
        try {
            await addQuoteToCollection({ collection_id: collectionId, quote }).unwrap();
            Alert.alert(
                '✅ Success!',
                `Quote added to "${collectionName}"`,
                [{ text: 'OK', onPress: onClose }]
            );
        } catch (error: any) {
            console.error('Add to collection error:', error);

            if (error.message?.includes('duplicate') ||
                error.message?.includes('already exists') ||
                error.message?.includes('unique constraint')) {
                Alert.alert(
                    'Already Added',
                    `This quote is already in "${collectionName}"`,
                    [{ text: 'OK' }]
                );
            } else if (error.message?.includes('not authenticated') ||
                error.message?.includes('unauthorized')) {
                Alert.alert(
                    'Authentication Error',
                    'Please log in again to add quotes to collections',
                    [{ text: 'OK', onPress: onClose }]
                );
            } else if (error.message?.includes('network') ||
                error.message?.includes('connection')) {
                Alert.alert(
                    'Connection Error',
                    'Please check your internet connection and try again',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Retry', onPress: () => handleAddToCollection(collectionId, collectionName) }
                    ]
                );
            } else {
                Alert.alert(
                    'Error',
                    error.message || 'Failed to add quote to collection. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={[styles.modalContent, { backgroundColor: '#1A1A1A' }]}>
                    <View style={styles.modalHeader}>
                        <View style={styles.headerLeft}>
                            <Icon name="folder-open" size={24} color={colors.primary} />
                            <Text style={styles.modalTitle}>Add to Collection</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>Choose a collection to save this quote</Text>

                    <ScrollView style={styles.collectionsList} showsVerticalScrollIndicator={false}>
                        {isLoading ? (
                            <View style={styles.loadingState}>
                                <Icon name="hourglass-outline" size={32} color={colors.primary} />
                                <Text style={styles.loadingText}>Loading collections...</Text>
                            </View>
                        ) : collections.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Icon name="folder-open-outline" size={64} color="#666666" />
                                <Text style={styles.emptyText}>No collections yet</Text>
                                <Text style={styles.emptySubtext}>Create your first collection to organize quotes</Text>
                            </View>
                        ) : (
                            collections.map((collection) => {
                                const alreadyAdded = isQuoteInCollection(collection.id);
                                return (
                                    <TouchableOpacity
                                        key={collection.id}
                                        style={[
                                            styles.collectionItem,
                                            alreadyAdded && styles.collectionItemAdded,
                                        ]}
                                        onPress={() => handleAddToCollection(collection.id, collection.name)}
                                        disabled={isAdding}>
                                        <View style={styles.collectionInfo}>
                                            <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                                                <Icon name="folder" size={20} color={colors.primary} />
                                            </View>
                                            <View style={styles.collectionTextInfo}>
                                                <Text style={styles.collectionName}>{collection.name}</Text>
                                                {alreadyAdded && (
                                                    <Text style={styles.addedLabel}>Already added</Text>
                                                )}
                                            </View>
                                        </View>
                                        {alreadyAdded ? (
                                            <Icon name="checkmark-circle" size={24} color={colors.primary} />
                                        ) : (
                                            <Icon name="add-circle-outline" size={24} color={colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.createButton, { borderColor: colors.primary }]}
                        onPress={() => {
                            onClose();
                            Alert.alert(
                                'Create Collection',
                                'Go to Profile → Collections to create a new collection',
                                [{ text: 'OK' }]
                            );
                        }}>
                        <Icon name="add" size={20} color={colors.primary} />
                        <Text style={[styles.createButtonText, { color: colors.primary }]}>Create New Collection</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        flex: 1,
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '75%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    collectionsList: {
        paddingHorizontal: 20,
        maxHeight: 400,
    },
    loadingState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#888888',
        marginTop: 12,
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 16,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
    },
    collectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#0D0D0D',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    collectionItemAdded: {
        borderColor: '#00C853',
        backgroundColor: '#00C85310',
    },
    collectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionTextInfo: {
        flex: 1,
    },
    collectionName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    addedLabel: {
        fontSize: 12,
        color: '#00C853',
        marginTop: 2,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
