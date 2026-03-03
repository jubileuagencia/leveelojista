import { supabase } from '../lib/supabase';

export const fetchCart = async (userId) => {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      product:products (
        id,
        name,
        price,
        image_url
      )
    `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching cart:', error);
        return [];
    }

    // Flatten structure to match local cart format
    return data.map(item => ({
        cart_item_id: item.id,
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url
    }));
};

export const addToCartDB = async (userId, product) => {
    // Check if item exists
    const { data: existing, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .maybeSingle();

    if (fetchError) {
        console.error('Error checking cart item:', fetchError);
        throw fetchError;
    }

    if (existing) {
        // Update quantity
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id)
            .select();

        if (error) throw error;
        return data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('cart_items')
            .insert({
                user_id: userId,
                product_id: product.id,
                quantity: 1
            })
            .select();

        if (error) throw error;
        return data;
    }
};

export const updateQuantityDB = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', cartItemId);

        if (error) throw error;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
};

export const removeFromCartDB = async (cartItemId) => {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);

        if (error) throw error;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
};

export const clearCartDB = async (userId) => {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

    if (error) throw error;
};

// --- Local Storage Helpers (Guest Cart) ---

const LOCAL_CART_KEY = 'levee_guest_cart';

export const getLocalCart = () => {
    try {
        const stored = localStorage.getItem(LOCAL_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse local cart", e);
        return [];
    }
};

export const saveLocalCart = (items) => {
    try {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (e) {
        console.error("Failed to save local cart", e);
    }
};
