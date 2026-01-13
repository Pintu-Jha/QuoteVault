import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Collection } from '../types';

interface CollectionsContextType {
    collections: Collection[];
    createCollection: (name: string, description?: string) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
    addQuoteToCollection: (collectionId: string, quoteId: string) => Promise<void>;
    removeQuoteFromCollection: (collectionId: string, quoteId: string) => Promise<void>;
    getCollection: (id: string) => Collection | undefined;
    loadCollections: () => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        try {
            const collectionsData = await AsyncStorage.getItem('collections');
            if (collectionsData) {
                setCollections(JSON.parse(collectionsData));
            }
        } catch (error) {
            console.error('Failed to load collections:', error);
        }
    };

    const saveCollections = async (newCollections: Collection[]) => {
        try {
            await AsyncStorage.setItem('collections', JSON.stringify(newCollections));
        } catch (error) {
            console.error('Failed to save collections:', error);
        }
    };

    const createCollection = async (name: string, description?: string) => {
        const newCollection: Collection = {
            id: Date.now().toString(),
            name,
            description,
            quoteIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const newCollections = [...collections, newCollection];
        setCollections(newCollections);
        await saveCollections(newCollections);
    };

    const deleteCollection = async (id: string) => {
        const newCollections = collections.filter(c => c.id !== id);
        setCollections(newCollections);
        await saveCollections(newCollections);
    };

    const updateCollection = async (id: string, updates: Partial<Collection>) => {
        const newCollections = collections.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
        );
        setCollections(newCollections);
        await saveCollections(newCollections);
    };

    const addQuoteToCollection = async (collectionId: string, quoteId: string) => {
        const collection = collections.find(c => c.id === collectionId);
        if (collection && !collection.quoteIds.includes(quoteId)) {
            await updateCollection(collectionId, {
                quoteIds: [...collection.quoteIds, quoteId],
            });
        }
    };

    const removeQuoteFromCollection = async (collectionId: string, quoteId: string) => {
        const collection = collections.find(c => c.id === collectionId);
        if (collection) {
            await updateCollection(collectionId, {
                quoteIds: collection.quoteIds.filter(id => id !== quoteId),
            });
        }
    };

    const getCollection = (id: string): Collection | undefined => {
        return collections.find(c => c.id === id);
    };

    return (
        <CollectionsContext.Provider
            value={{
                collections,
                createCollection,
                deleteCollection,
                updateCollection,
                addQuoteToCollection,
                removeQuoteFromCollection,
                getCollection,
                loadCollections,
            }}>
            {children}
        </CollectionsContext.Provider>
    );
};

export const useCollections = () => {
    const context = useContext(CollectionsContext);
    if (!context) {
        throw new Error('useCollections must be used within CollectionsProvider');
    }
    return context;
};
