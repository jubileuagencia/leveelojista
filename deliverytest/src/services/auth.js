import { supabase } from '../lib/supabase';

/**
 * Register a new user with company data and address.
 * The DB Trigger 'handle_new_user' will automatically create Profile and Address.
 */
export const registerUser = async ({ email, password, metadata }) => {
    try {
        const { data: { user }, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (authError) throw authError;
        if (!user) throw new Error("Erro ao criar usuário.");

        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};
