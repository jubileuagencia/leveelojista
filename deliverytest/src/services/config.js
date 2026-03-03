import { supabase } from '../lib/supabase';

// Cache to avoid constant fetching on components
let configCache = {};

export const getAppConfig = async (key) => {
    // Return cached if available
    if (configCache[key]) {
        return configCache[key];
    }

    const { data, error } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        console.error(`Error fetching config for ${key}:`, error);
        return null; // Return null (or default) if failed
    }

    // Update cache
    configCache[key] = data.value;
    return data.value;
};

// Real-time subscription to global config changes
export const subscribeToConfigChanges = (key, callback) => {
    const channel = supabase
        .channel(`public:app_config:${key}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'app_config',
                filter: `key=eq.${key}`,
            },
            (payload) => {

                // Update cache
                configCache[key] = payload.new.value;
                // Notify
                callback(payload.new.value);
            }
        )
        .subscribe();

    return {
        unsubscribe: () => {
            supabase.removeChannel(channel);
        },
    };
};
