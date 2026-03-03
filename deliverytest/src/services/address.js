import { supabase } from '../lib/supabase';

export const getUserAddresses = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_main', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};

export const createAddress = async (addressData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // If setting as main, use RPC for atomic toggle
        if (addressData.is_main) {
            // First insert without is_main, then set via RPC
            const { data, error } = await supabase
                .from('user_addresses')
                .insert([{ ...addressData, is_main: false, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            // Atomically set as main via RPC
            await setMainAddress(data.id);
            return { ...data, is_main: true };
        }

        const { data, error } = await supabase
            .from('user_addresses')
            .insert([{ ...addressData, user_id: user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating address:', error);
        throw error;
    }
};

/**
 * Atomically sets an address as the main address.
 * Uses a Postgres RPC to ensure only one address is marked as main.
 * Falls back to client-side logic if the RPC is not yet deployed.
 */
export const setMainAddress = async (addressId) => {
    try {
        const { error } = await supabase.rpc('set_main_address', {
            target_address_id: addressId
        });

        if (error) {
            // Fallback: if RPC doesn't exist yet, do it client-side
            if (error.message?.includes('function') || error.code === '42883') {
                console.warn('set_main_address RPC not found, using fallback');
                return await setMainAddressFallback(addressId);
            }
            throw error;
        }
    } catch (error) {
        console.error('Error setting main address:', error);
        throw error;
    }
};

/**
 * Fallback: non-atomic main address toggle (pre-RPC).
 * Will be removed once the RPC is deployed.
 */
const setMainAddressFallback = async (addressId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Unmark all
    await supabase
        .from('user_addresses')
        .update({ is_main: false })
        .eq('user_id', user.id);

    // Mark target
    const { error } = await supabase
        .from('user_addresses')
        .update({ is_main: true })
        .eq('id', addressId);

    if (error) throw error;
};
