import { supabase } from '../lib/supabase';

/**
 * Fetch clients with pagination and search.
 * Uses the secure RPC function 'get_admin_clients'.
 */
export const getClients = async (page = 1, limit = 20, searchTerm = '', filters = {}) => {
    try {
        const { data, error } = await supabase
            .rpc('get_admin_clients', {
                page,
                page_size: limit,
                search_term: searchTerm,
                filter_tiers: filters.tiers || null, // Expecting array ['bronze', 'silver']
                filter_roles: filters.roles || null  // Expecting array ['customer', 'admin']
            });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
    }
};

/**
 * Get full details for a specific client (Profile + Addresses).
 */
export const getClientDetails = async (clientId) => {
    try {
        // 1. Fetch Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', clientId)
            .single();

        if (profileError) throw profileError;

        // 2. Fetch Addresses
        const { data: addresses, error: addrError } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', clientId)
            .order('is_main', { ascending: false });

        if (addrError) throw addrError;

        // 3. Fetch Email (Need to use the RPC hack if we want email in details too, 
        // or just pass it from the list view. For now, let's just return profile + addresses)

        return { ...profile, addresses: addresses || [] };
    } catch (error) {
        console.error('Error fetching client details:', error);
        throw error;
    }
};

/**
 * Update client TIER or generic profile data.
 * Protected by 'profiles_update_admin' policy.
 */
export const updateClientProfile = async (clientId, updates) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', clientId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating client profile:', error);
        throw error;
    }
};

/**
 * Update client Email (Admin Only).
 * Uses secure RPC 'update_admin_user_email'.
 */
export const updateClientEmail = async (clientId, newEmail) => {
    try {
        const { error } = await supabase
            .rpc('update_admin_user_email', {
                target_user_id: clientId,
                new_email: newEmail
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating client email:', error);
        throw error;
    }
};

/**
 * Address Management Methods (Admin Privileges)
 */

export const addClientAddress = async (addressData) => {
    try {
        const { data, error } = await supabase
            .from('user_addresses')
            .insert(addressData);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding client address:', error);
        throw error;
    }
};

export const updateClientAddress = async (addressId, updates) => {
    try {
        const { data, error } = await supabase
            .from('user_addresses')
            .update(updates)
            .eq('id', addressId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating client address:', error);
        throw error;
    }
};

export const deleteClientAddress = async (addressId) => {
    try {
        const { error } = await supabase
            .from('user_addresses')
            .delete()
            .eq('id', addressId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting client address:', error);
        throw error;
    }
};
