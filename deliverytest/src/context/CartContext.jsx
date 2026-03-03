import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    fetchCart,
    addToCartDB,
    updateQuantityDB,
    removeFromCartDB,
    clearCartDB,
    getLocalCart,
    saveLocalCart
} from '../services/cart';
import { sendCartNotification } from '../services/notifications';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync with DB on login or load local cart
    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            if (user) {
                try {
                    // fetchCart already returns items with cart_item_id
                    const items = await fetchCart(user.id);
                    setCartItems(items);
                } catch (error) {
                    console.error("Failed to load cart from DB", error);
                }
            } else {
                const localItems = getLocalCart();
                setCartItems(localItems);
            }
            setLoading(false);
        };
        loadCart();
    }, [user]);

    // Add Item
    const addToCart = useCallback(async (product) => {
        // Optimistic Update (without cart_item_id, will be synced after DB call)
        setCartItems((prev) => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });

        // Side Effects
        if (user) {
            try {
                const result = await addToCartDB(user.id, product);
                // Sync cart_item_id into state after DB confirms
                if (result && result[0]) {
                    const dbItem = result[0];
                    setCartItems(prev => prev.map(item =>
                        item.id === product.id
                            ? { ...item, cart_item_id: dbItem.id, quantity: dbItem.quantity }
                            : item
                    ));
                }
            } catch (err) {
                console.error("Failed to add to DB cart", err);
            }
        } else {
            // Guest Persistence
            const currentItems = getLocalCart();
            const existing = currentItems.find(item => item.id === product.id);
            let updatedLocalItems;

            if (existing) {
                updatedLocalItems = currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedLocalItems = [...currentItems, { ...product, quantity: 1 }];
            }
            saveLocalCart(updatedLocalItems);
            setCartItems(updatedLocalItems);
        }

        sendCartNotification(product);
    }, [user]);

    // Update Quantity — uses cart_item_id from state, no refetch needed
    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Optimistic update
        setCartItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));

        if (user) {
            try {
                // Find cart_item_id from current state (set during loadCart or addToCart sync)
                const item = cartItems.find(i => i.id === productId);
                if (item?.cart_item_id) {
                    await updateQuantityDB(item.cart_item_id, newQuantity);
                } else {
                    // Fallback: if cart_item_id missing (edge case), reload cart
                    console.warn('cart_item_id not found for product', productId, '— reloading cart');
                    const freshItems = await fetchCart(user.id);
                    setCartItems(freshItems);
                }
            } catch (e) {
                console.error("Failed to update quantity in DB", e);
            }
        } else {
            const currentItems = getLocalCart();
            const updated = currentItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
            saveLocalCart(updated);
            setCartItems(updated);
        }
    }, [user, cartItems]);

    // Remove Item — uses cart_item_id from state, no refetch needed
    const removeFromCart = useCallback(async (productId) => {
        // Optimistic update
        setCartItems(prev => prev.filter(i => i.id !== productId));

        if (user) {
            try {
                // Find cart_item_id from current state
                const item = cartItems.find(i => i.id === productId);
                if (item?.cart_item_id) {
                    await removeFromCartDB(item.cart_item_id);
                } else {
                    console.warn('cart_item_id not found for product', productId, '— skipping DB delete');
                }
            } catch (e) {
                console.error("Failed to remove item from DB cart", e);
            }
        } else {
            const currentItems = getLocalCart();
            const updated = currentItems.filter(item => item.id !== productId);
            saveLocalCart(updated);
            setCartItems(updated);
        }
    }, [user, cartItems]);

    // Clear Cart
    const clearCart = useCallback(async () => {
        setCartItems([]);
        if (user) {
            try {
                await clearCartDB(user.id);
            } catch (e) {
                console.error("Failed to clear cart in DB", e);
            }
        } else {
            saveLocalCart([]);
        }
    }, [user]);

    const value = {
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
