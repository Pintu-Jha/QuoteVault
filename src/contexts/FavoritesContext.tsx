import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote } from '../types';

interface FavoritesContextType {
    favorites: Quote[];
    isFavorite: (quoteId: string) => boolean;
    toggleFavorite: (quote: Quote) => Promise<void>;
    loadFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Quote[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const favoritesData = await AsyncStorage.getItem('favorites');
            if (favoritesData) {
                setFavorites(JSON.parse(favoritesData));
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    const saveFavorites = async (newFavorites: Quote[]) => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    };

    const isFavorite = (quoteId: string): boolean => {
        return favorites.some(fav => fav.id === quoteId);
    };

    const toggleFavorite = async (quote: Quote) => {
        let newFavorites: Quote[];
        if (isFavorite(quote.id)) {
            newFavorites = favorites.filter(fav => fav.id !== quote.id);
        } else {
            newFavorites = [...favorites, quote];
        }
        setFavorites(newFavorites);
        await saveFavorites(newFavorites);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loadFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};
