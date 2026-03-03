import { supabase } from '../lib/supabase';

export const getFavorites = async (userId) => {
    const { data, error } = await supabase
        .from('favorites')
        .select(`
            id,
            product_id,
            products:product_id (
                id,
                name,
                price,
                image_url,
                description
            )
        `)
        .eq('user_id', userId);

    if (error) throw error;

    // Transform data flat
    return data
        .filter(fav => fav.products !== null)
        .map(fav => ({
            id: fav.product_id,
            ...fav.products
        }));
};

export const addFavorite = async (userId, productId) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .insert([{ user_id: userId, product_id: productId }])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

export const removeFavorite = async (userId, productId) => {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};
