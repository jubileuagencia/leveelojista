import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../services/favorites';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch favorites when user changes
    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setFavorites([]);
            setLoading(false);
        }
    }, [user]);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const data = await getFavorites(user.id);
            // Store just the IDs for quick lookup in isFavorite
            // But wait, the service checks for 'products' join. 
            // The service returns the list of products directly.
            // But 'favorites' state is used for isFavorite(id) check.
            // Let's modify state strategy or service.
            // Current service 'getFavorites' returns full product objects.
            // We need IDs for fast checkout.

            // Let's optimize: Store full objects in 'favorites' state?
            // Or keep 'favorites' as IDs list?
            // The previous context kept 'favorites' as IDs list (lines 33-34).
            // But getFavoritesWithDetails did a separate fetch.

            // Let's update the strategy:
            // 1. Fetch all favorites (full objects) on load.
            // 2. Store them.
            // 3. isFavorite checks if ID exists in list.
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(fav => fav.id === productId);
    };

    const toggleFavorite = async (productId, product = null) => {
        if (!user) return false;

        const isFav = isFavorite(productId);

        if (isFav) {
            // Optimistic remove
            const previousFavorites = [...favorites];
            setFavorites(prev => prev.filter(fav => fav.id !== productId));

            try {
                await removeFavorite(user.id, productId);
                return true;
            } catch (error) {
                console.error('Error removing favorite:', error);
                setFavorites(previousFavorites); // Rollback
                return false;
            }
        } else {
            // Optimistic add
            if (product) {
                const optimisticItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    description: product.description || ''
                };
                setFavorites(prev => [...prev, optimisticItem]);
            }

            try {
                await addFavorite(user.id, productId);
                // If we didn't have the product object, fetch to sync
                if (!product) {
                    await loadFavorites();
                }
                return true;
            } catch (error) {
                console.error('Error adding favorite:', error);
                // Rollback optimistic add
                if (product) {
                    setFavorites(prev => prev.filter(fav => fav.id !== productId));
                }
                return false;
            }
        }
    };

    // Deprecated/Alias for compatibility or used by page
    const getFavoritesWithDetails = async () => {
        return favorites;
    };

    return (
        <FavoritesContext.Provider value={{ favorites, loading, isFavorite, toggleFavorite, getFavoritesWithDetails }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    return useContext(FavoritesContext);
};
