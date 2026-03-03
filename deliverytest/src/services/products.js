import { supabase } from '../lib/supabase';

export const getProducts = async (limit = null) => {
    try {
        let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .is('deleted_at', null)
            .order('id', { ascending: true });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getAdminProducts = async (page = 0, limit = 50, filters = {}) => {
    try {
        const start = page * limit;
        const end = start + limit - 1;

        let query = supabase
            .from('products')
            .select('*, categories(name)', { count: 'exact' })
            .is('deleted_at', null);

        // Apply filters
        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }

        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }

        if (filters.status === 'active') {
            query = query.eq('is_active', true);
        } else if (filters.status === 'inactive') {
            query = query.eq('is_active', false);
        }

        const { data, error, count } = await query
            .order('display_id', { ascending: true })
            .range(start, end);

        if (error) throw error;
        return { data, count };
    } catch (error) {
        console.error('Error fetching admin products:', error);
        throw error;
    }
};


export const getCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name, icon, color')
            .order('name');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getProductsByCategory = async (categoryName, page = 0, limit = 12) => {
    try {
        const start = page * limit;
        const end = start + limit - 1;

        const { data, error } = await supabase
            .from('products')
            .select('*, categories!inner(name)')
            .ilike('categories.name', categoryName)
            .range(start, end);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error fetching products for category ${categoryName}:`, error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

export const searchProducts = async (query) => {
    if (!query) return [];

    try {
        const { data, error } = await supabase
            .rpc('search_products_v2', { query_term: query });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// ═══════════════════════════════════════════════
// ADMIN CRUD
// ═══════════════════════════════════════════════

/**
 * Criar novo produto.
 * RLS exige role = 'admin'.
 */
export const createProduct = async (productData) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert({
                name: productData.name,
                description: productData.description || null,
                price: productData.price,
                unit: productData.unit || 'un',
                image_url: productData.image_url || null,
                category_id: productData.category_id || null,
                is_active: productData.is_active ?? true,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

/**
 * Atualizar produto existente.
 * RLS exige role = 'admin'.
 */
export const updateProduct = async (id, productData) => {
    try {
        const updates = {};
        if (productData.name !== undefined) updates.name = productData.name;
        if (productData.description !== undefined) updates.description = productData.description;
        if (productData.price !== undefined) updates.price = productData.price;
        if (productData.unit !== undefined) updates.unit = productData.unit;
        if (productData.image_url !== undefined) updates.image_url = productData.image_url;
        if (productData.category_id !== undefined) updates.category_id = productData.category_id;
        if (productData.is_active !== undefined) updates.is_active = productData.is_active;

        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

/**
 * Soft-delete: marca deleted_at e desativa (is_active = false).
 */
export const deleteProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: new Date().toISOString(),
                is_active: false
            })
            .eq('id', id);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

/**
 * Ativar/desativar produto.
 */
export const toggleProductStatus = async (id, isActive) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ is_active: isActive })
            .eq('id', id);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error toggling product status:', error);
    }
};

/**
 * Atualização em massa de status.
 */
export const bulkUpdateStatus = async (ids, isActive) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ is_active: isActive })
            .in('id', ids);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error bulk updating status:', error);
        throw error;
    }
};

/**
 * Exclusão em massa (Soft Delete).
 */
export const bulkDeleteProducts = async (ids) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                deleted_at: new Date().toISOString(),
                is_active: false
            })
            .in('id', ids);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error bulk deleting products:', error);
        throw error;
    }
};

